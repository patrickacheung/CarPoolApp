
Create table Person (
	ID int IDENTITY(1,1),
	Username nvarchar(max) NOT NULL,
	PasswordHash nvarchar(max) NOT NULL,
	Salt nvarchar(max) NOT NULL,
	Email nvarchar(max) NOT NULL,
	PRIMARY KEY(ID)
);

Create table CarPool (
	ID int IDENTITY(1, 1),
	DriverID int,
	Seats int NOT NULL,
	CarDescription nvarchar(max) NOT NULL,
	StartLocation nvarchar(max) NOT NULL,
	EndLocation nvarchar(max) NOT NULL,
	AdditionalDetails nvarchar(max),
	ArrivalTime time NOT NULL,
	PRIMARY KEY(ID),
	FOREIGN KEY(DriverID) REFERENCES Person(ID)
);

Create table WeekDay (
	ID int IDENTITY(1, 1),
	Name nvarchar(50) UNIQUE NOT NULL,
	PRIMARY KEY(ID)
);

Create table Occurance (
	CarPoolID int,
	DayID int,
	PRIMARY KEY(CarPoolID, DayID),
	FOREIGN KEY(CarPoolID) REFERENCES CarPool(ID),
	FOREIGN KEY(DayID) REFERENCES WeekDay(ID)
);

INSERT INTO WeekDay (Name) VALUES ('Monday'), ('Tuesday'), ('Wednesday'), ('Thursday'), ('Friday'), ('Saturday'), ('Sunday')