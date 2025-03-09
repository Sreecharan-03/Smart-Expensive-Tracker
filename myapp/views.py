from django.shortcuts import render,redirect
from django.contrib.auth.models import User,auth
from django.contrib import messages
from .models import Feature


#from django.http import HttpResponse
# Create your views here.
def index(request):
    return render(request , 'index.html')

def register(request):
    if request.method == 'POST':
        first_name = request.POST['First']
        last_name = request.POST['Last']
        username = request.POST['username']
        password = request.POST['password']
        password2 = request.POST['password2']
        email = request.POST['email']
        phno = request.POST['phno']

        if password == password2:
            if User.objects.filter(email=email).exists():
                messages.info(request,'Email Already Exists')
                return redirect('register')
            
            elif User.objects.filter(username=username).exists():
                messages.info(request , 'Username already exists')
                return redirect('register')
            else:
                user = User.objects.create_user(first_name=first_name,last_name=last_name,username=username,password=password,email=email)
                user.save()
                return redirect('login')
        else:
            messages.info(request,'pass not same')
            return redirect('register')
           
    else:
        return render(request , 'register.html') 
    
def login(request):
    if request.method=='POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username,password=password)

        if user is not None:
            auth.login(request , user)
            return redirect('/')
        else:
            messages.info(request , 'Credentials Invalid.')
            return redirect('login')
    else:
        return render(request ,'login.html')
    
def logout(request):
    auth.logout(request)
    return redirect('/')

def dashboard(request):
    # if request.method == 'POST':
    #     data = request.POST

    #     Expense_name = data.get('Expense_name')
    #     Amount = data.get('Amount')
    #     Category = data.get('Category')
    #     Date = data.get('Date')

    #     try:
    #         # Convert Amount to an integer
    #         Amount = int(Amount)

    #         # Create and save the object
    #         table = Feature.objects.create(
    #             Expense_name=Expense_name,
    #             Amount=Amount,
    #             Category=Category,
    #             Date=Date
    #         )
    #         table.save()

    #         return redirect('dashboard')
    #     except ValueError:
    #         # Handle the case where Amount is not a valid integer
    #         return render(request, 'dashboard.html', {'error': 'Invalid Amount value'})

    # else:
        return render(request, 'dashboard.html')

def calc(request):
    return render(request , 'calc.html')

def goal(request):
    return render(request , 'goal.html')

def ipo(request):
    return render(request , 'ipo.html')

def counter(request):
    text = request.POST['words']
    amount_of_words = len(text.split())
    return render(request , 'counter.html',{'amount':amount_of_words})