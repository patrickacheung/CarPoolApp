Create table Car (
	CarID int,
	Color varchar(60),
	Seats int,
	PRIMARY KEY (CarID)
)

Create table Person (
	UserID int,
	Username varchar(60) NOT NULL,
	email varchar(60),
	PRIMARY KEY (UserID)
);

Create table Owns (
	UserID int,
	CarID int,
	PRIMARY KEY (UserID, CarID)
)

Create table Carpool (
	CarpoolID int,
	Driver int,
	CarID int,
	StartLocation varchar(60),
	EndLocation varchar(60),
	PRIMARY KEY (CarpoolID),
	CONSTRAINT DriverForeignKey FOREIGN KEY (Driver) REFERENCES Person,
	CONSTRAINT CarForeignKey FOREIGN KEY (CarID) REFERENCES Car
);
