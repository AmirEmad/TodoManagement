# Todo Management Application

A simple Todo management application with basic CRUD operations and status management built with ASP.NET Core and Bootstrap.

## Features

- Create, Read, Update, and Delete todos
- Filter todos by status (Pending, In Progress, Completed)
- Mark todos as complete
- Set priority (Low, Medium, High) for todos
- Set optional due dates for todos
- Form validation
- Clean UI with Bootstrap

## Technical Details

### Backend
- ASP.NET Core 8
- Entity Framework Core for data access
- Clean architecture with layers (Core, Application, Infrastructure, API)
- RESTful API design
- Proper error handling and validation

### Frontend
- Bootstrap 5 UI
- Responsive design
- Client-side validation
- Dynamic UI updates

## Project Structure

- **TodoManagement.Core**: Domain entities, interfaces, and business logic
- **TodoManagement.Application**: Application services, DTOs, and business rules
- **TodoManagement.Infrastructure**: Data access, repository implementations
- **TodoManagement.API**: API controllers, Startup configuration, and frontend

## Setup Instructions

### Prerequisites
- .NET 9 SDK
- SQL Server (or LocalDB)
- Visual Studio 2022 or VS Code

### Database Setup
1. Update the connection string in `appsettings.json` if needed
2. Open a terminal in the project root and run:
```
dotnet ef migrations add InitialCreate -p TodoManagement.Infrastructure -s TodoManagement.API
dotnet ef database update -p TodoManagement.Infrastructure -s TodoManagement.API
```

### Running the Application
1. Clone the repository
2. Navigate to the solution directory
3. Run application in ISS Express
4. Open your browser and navigate to `https://localhost:44368/swagger/index.html`

## API Endpoints

| Method | URL                            | Description                |
|--------|--------------------------------|----------------------------|
| GET    | /api/todos                     | Get all todos              |
| GET    | /api/todos?status={status}     | Get todos by status        |
| GET    | /api/todos/{id}                | Get todo by ID             |
| POST   | /api/todos                     | Create a new todo          |
| PUT    | /api/todos/{id}                | Update a todo              |
| PATCH  | /api/todos/{id}/status         | Update a todo's status     |
| POST   | /api/todos/{id}/complete       | Mark a todo as complete    |
| DELETE | /api/todos/{id}                | Delete a todo              |

## Optional Enhancements

The following optional enhancements have been implemented:

- Domain events (TodoCompletedEvent)
- Additional filtering by priority
- Sorting by status, priority, and due date
- Basic API documentation using Swagger

## Notes

- The application follows proper separation of concerns with a layered architecture
- Error handling is implemented at both the API and UI levels
- Data validation is performed on both the server and client sides
