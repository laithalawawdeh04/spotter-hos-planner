# Spotter AI - Hours of Service (HOS) Planner

An FMCSA-compliant HOS Planner built with **Django REST Framework** (Backend) and **React + Vite + Tailwind CSS** (Frontend).

## Features
- **FMCSA Compliance**: Automatically calculates driving hours, mandatory 30-minute breaks after 8 hours of driving, and 10-hour sleeper berth periods.
- **Interactive UI**: Clean, dark-mode interface with immediate timeline visualizer.
- **RESTful API**: Clean separation between Django backend business logic and React state management.

## Tech Stack
- **Backend**: Python 3.x, Django, Django REST Framework, Django-CORS-Headers
- **Frontend**: React, Vite, Tailwind CSS v4, Axios, Lucide-React

## How to Run Locally

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver