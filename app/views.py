import json

from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UploadFileForm
from .util import import_from_json

# Create your views here.

def index(request):
    return render(request, 'index.html')



def upload(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES['file']
            file = file.read().decode('utf-8')
            if not import_from_json(file):
                messages.error(request, 'Error importing data')
                return redirect('upload')
            return redirect('index')
    else:
        form = UploadFileForm()
    return render(request, 'upload.html', {'form': form})