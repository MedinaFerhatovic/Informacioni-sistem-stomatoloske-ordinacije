create database dental_clinic;
use dental_clinic;

create table User (
    userID int auto_increment primary key,
    firstName varchar(50),
    lastName varchar(50),
    email varchar(100),
    password varchar(50),
    role enum('pacijent', 'doktor', 'admin')
);

create table Location(
    locationID int auto_increment primary key,
    latitude decimal(10, 8),
    longitude decimal(11, 8),
    address varchar(255),
    locationName varchar(100)
);

create table Ordination (
	ordinationID int auto_increment primary key,
    name varchar(100),
    locationID int,
    phoneNumber varchar(20),
    owner int,
    address varchar(255),
    foreign key (locationID) references Location(locationID),
    foreign key (owner) references User(userID)
);

create table Appointment (
    appointmentID int auto_increment primary key,
    ordinationID int,
    dateTime datetime,
    available boolean,
    foreign key (ordinationID) references Ordination(ordinationID)
);

create table DentalRecord (
	dentalRecordID int auto_increment primary key,
    number varchar(50) unique,
    patientID int,
    ordinationID int,
    visitDate date,
    examination text,
    recipe text,
    addition text,
    foreign key (patientID) references User(userID),
    foreign key (ordinationID) references Ordination(ordinationID)
);

create table Staff (
	staffID int auto_increment primary key,
    firstName varchar(50),
    lastName varchar(50),
    position varchar(50),
    ordinationID int,
    foreign key (ordinationID) references Ordination(ordinationID)
);

create table Service (
	serviceID int auto_increment primary key,
    ordinationID int,
    serviceName varchar(255),
    description text,
    price decimal(10, 2),
    foreign key (ordinationID) references Ordination(ordinationID)
);

create table Reservation (
    reservationID int auto_increment primary key,
    userID int,
    appointmentID int,
    serviceID int,
    reservationDate datetime,
    status varchar(20),
    description text,
    age int,
    phoneNumber varchar(20),
    foreign key (userID) references User(userID),
    foreign key (appointmentID) references Appointment(appointmentID),
    foreign key (serviceID) references Service(serviceID)
);




