from django.db import models

# Create your models here.

class Feature(models.Model):
    Expense_name = models.CharField(max_length=500)
    Amount = models.IntegerField()
    Category = models.CharField(max_length=200)
    Date = models.DateField()