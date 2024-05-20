from io import BytesIO
import pandas
from django.http import HttpResponse
from bs4 import BeautifulSoup
import requests
import openai
from googlesearch import search

from rest_framework.views import APIView
from .serializer import UserSerializer
from rest_framework.response import Response
from .models import User
from rest_framework.exceptions import AuthenticationFailed
import jwt


class RegisterView(APIView):
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')

        payload = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'position': user.position,
            'email': user.email,
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        responce = Response()

        responce.set_cookie(key='jwt', value=token, httponly=True, samesite='None', secure=True)
        responce.data = {
            'jwt': token
        }
        return responce


class UserView(APIView):
    def get(self,request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)

        return Response(serializer.data)


class LogoutView(APIView):
    def post(self,request):
        responce = Response()
        responce.delete_cookie('jwt')
        responce.data = {
            'message': 'success'
        }
        return responce



openai.api_key = "sk-proj-jiVS4dHOmxNsFL1aInQuT3BlbkFJItkPf1ZsuZZFRlsVXgAO"
proxy = 'http://185.117.154.164:80/'


class ParsingView(APIView):
    def post(self, request):
        user_search = request.data['user_search']
        category = request.data['category']

        # search_results = []
        # for j in search(user_search, proxy=proxy, num_results=10):
        #     if j not in search_results:
        #         search_results.append(j)
        #
        # website_content = []
        # for search_result in search_results:
        #     ans = requests.get(search_result, timeout=10)
        #     soup = BeautifulSoup(ans.text, "html.parser")
        #     website_content.append(soup.get_text())
        #
        # with open("website_content.html", "w", encoding='utf-8') as file:
        #     for content in website_content:
        #         file.write(content)

        with open("website_content.html", "r", encoding='utf-8') as file:
            file_content = file.read()[:10000]
        chat_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"{category} {file_content}"},
            ]
        )
        chat_responses = chat_response["choices"][0]["message"]["content"]

        index_list=[]
        for i in range(len(chat_responses)):
            index_list.append(i)

        df = pandas.DataFrame({'Index': index_list, 'ChatGPT Responses': chat_responses})
        output = BytesIO()
        writer = pandas.ExcelWriter(output, engine='xlsxwriter')
        df.to_excel(writer)
        writer.close()

        response = HttpResponse(output.getvalue(), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename=report.xlsx'

        return response