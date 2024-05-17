# Hotel Booking Management App

This is a Django-based web application for managing hotel bookings.

## Features

- Uploading hotel data via JSON
- User authentication
- Hotel searching by distance: User specifies a radius in kilometers to find all nearby hotels
- Displaying all found hotels and their available rooms alongside their prices
- Hotel room booking: User can book one or more of the available rooms
- Reservation management: User can cancel their reservation or change the booked room at least two hours before the check-in
- Feedback system: User can leave feedback about services, cleanliness, etc.


## Database Setup

Before running the server, you need to apply the migrations.

1. Apply the migrations with `python manage.py migrate`

## Installation

1. Clone the repository
2. Install the dependencies with `pip install -r requirements.txt`
3. Set up the database (see Database Setup above)
4. Run the server with `python manage.py runserver`

## Usage

Navigate to `localhost:8000` in your web browser to access the application.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)