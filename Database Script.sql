CREATE DATABASE ApexCareSolutionsDB;
GO

USE ApexCareSolutionsDB;
GO

CREATE TABLE Clients (
	ClientId INT PRIMARY KEY IDENTITY(1,1),
	Name NVARCHAR(100) NOT NULL,
	Email NVARCHAR(100) NOT NULL UNIQUE,
	Phone NVARCHAR(15) NOT NULL,
	Address NVARCHAR(255) NOT NULL,
);
GO

CREATE TABLE Contracts (
	ContractId INT PRIMARY KEY IDENTITY(1,1),
	ClientId INT NOT NULL,
	StartDate DATE NOT NULL,
	EndDate DATE NOT NULL,
	ServiceLevel NVARCHAR(50) NOT NULL,
	IsActive BIT NOT NULL,
	CONSTRAINT FK_Contracts_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId)
);
GO

CREATE TABLE Technicians (
	TechnicianId INT PRIMARY KEY IDENTITY(1,1),
	Name NVARCHAR(100) NOT NULL,
	SkillSet NVARCHAR(255) NOT NULL,
	Location NVARCHAR(100) NOT NULL,
	AvailabilityStatus NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE ServiceRequests (
	ServiceRequestId INT PRIMARY KEY IDENTITY(1,1),
	ClientId INT NOT NULL,
	TechnicianId INT, -- Nullable as the technician may be assigned later
	IssueDescription NVARCHAR(MAX) NOT NULL,
	Priority NVARCHAR(50) NOT NULL,
	Status NVARCHAR(50) NOT NULL,
	AssignedDate DATE NULL,
	ResolutionDate DATE NULL,
	CONSTRAINT FK_ServiceRequests_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId),
	CONSTRAINT FK_ServiceRequests_Technician FOREIGN KEY (TechnicianId) REFERENCES Technicians(TechnicianId)
);
GO

CREATE TABLE Feedback (
	FeedbackId INT PRIMARY KEY IDENTITY(1,1),
	ClientId INT NOT NULL,
	ServiceRequestId INT NOT NULL,
	Rating INT CHECK (Rating >= 1 AND Rating <= 5), -- Rating between 1 and 5
	Comments NVARCHAR(MAX),
	DateProvided DATE DEFAULT GETDATE(),
	CONSTRAINT FK_Feedback_Client FOREIGN KEY (ClientId) REFERENCES Clients(ClientId),
	CONSTRAINT FK_Feedback_ServiceRequest FOREIGN KEY (ServiceRequestId) REFERENCES ServiceRequests(ServiceRequestId)
);
GO

-- Populating the tables
INSERT INTO Clients (Name, Email, Phone, Address)
VALUES 
    ('John Doe', 'john.doe@example.com', '555-1234', '123 Main St'),
    ('Jane Smith', 'jane.smith@example.com', '555-5678', '456 Oak Ave'),
    ('Bob Johnson', 'bob.johnson@example.com', '555-9876', '789 Pine Rd');

INSERT INTO Contracts (ClientId, StartDate, EndDate, ServiceLevel, IsActive)
VALUES 
    (1, '2024-01-01', '2024-12-31', 'Premium', 1), 
    (2, '2024-02-01', '2024-12-31', 'Standard', 1),
    (3, '2024-03-01', '2024-12-31', 'Basic', 1);

INSERT INTO Technicians (Name, SkillSet, Location, AvailabilityStatus)
VALUES 
    ('Mike Ross', 'Electrical, HVAC', 'Pretoria', 'Busy'),
    ('Rachel Zane', 'Plumbing, HVAC', 'Cape Town', 'Busy'),
    ('Louis Litt', 'Networking, Security Systems', 'Bloemfontein', 'Available');

INSERT INTO ServiceRequests (ClientId, IssueDescription, Priority, Status, AssignedDate)
VALUES 
    (1, 'HVAC system failure', 'High', 'Open', GETDATE()), 
    (2, 'Leaking pipe in basement', 'Medium', 'Open', GETDATE()),
    (3, 'Network outage in office', 'High', 'Open', GETDATE());

UPDATE ServiceRequests 
SET TechnicianId = 1, AssignedDate = '2024/01/01', Status = 'In Progress'
WHERE ServiceRequestId = 1;

UPDATE ServiceRequests 
SET TechnicianId = 2, AssignedDate = '2024/02/01', Status = 'In Progress'
WHERE ServiceRequestId = 2;

-- Added for M4
INSERT INTO ServiceRequests (ClientId, TechnicianId, IssueDescription, Priority, Status, AssignedDate, ResolutionDate)
VALUES 
    (1, 1, 'Air conditioner serviced', 'Low', 'Complete', '2024-10-20', '2024-10-22'), 
    (3, 1, 'Electrical wiring fixed', 'Medium', 'Complete', '2024-10-21', '2024-10-21'),
    (3, 3, 'Internet connection restored', 'High', 'Complete', '2024-10-22', '2024-10-22');

UPDATE ServiceRequests 
SET IssueDescription = 'Air conditioner in need of service'
WHERE ServiceRequestId = 4;

UPDATE ServiceRequests 
SET IssueDescription = 'Electrical wiring faulty'
WHERE ServiceRequestId = 5;

UPDATE ServiceRequests 
SET IssueDescription = 'Internet connection unstable'
WHERE ServiceRequestId = 6;
-- End of Added Script

INSERT INTO Feedback (ClientId, ServiceRequestId, Rating, Comments)
VALUES 
    (1, 1, 5, 'Technician was very professional and resolved the issue quickly.'),
    (2, 2, 4, 'Good work, but the resolution took longer than expected.'),
    (3, 3, 3, 'Satisfactory work, but could improve communication.');
GO

-- Stored procedure to assign a technician to a service request
CREATE PROCEDURE AssignTechnician
	@ServiceRequestId INT,
	@TechnicianId INT
AS
BEGIN
	-- Update ServiceRequest with TechnicianId and AssignedDate
	UPDATE ServiceRequests
	SET TechnicianId = @TechnicianId,
		AssignedDate = GETDATE(),
		Status = 'In Progress'
	WHERE ServiceRequestId = @ServiceRequestId;
    
	-- Set the technician's availability status to 'Busy'
	UPDATE Technicians
	SET AvailabilityStatus = 'Busy'
	WHERE TechnicianId = @TechnicianId;
END;
GO

-- Stored procedure to close a service request
CREATE PROCEDURE CloseServiceRequest
	@ServiceRequestId INT
AS
BEGIN
	-- Update ServiceRequest status to 'Resolved' and set ResolutionDate
	UPDATE ServiceRequests
	SET Status = 'Resolved',
		ResolutionDate = GETDATE()
	WHERE ServiceRequestId = @ServiceRequestId;
    
	-- Retrieve the assigned technician for the request
	DECLARE @TechnicianId INT;
	SELECT @TechnicianId = TechnicianId FROM ServiceRequests WHERE ServiceRequestId = @ServiceRequestId;
    
	-- Set the technician's availability status to 'Available' if a technician was assigned
	IF @TechnicianId IS NOT NULL
	BEGIN
		UPDATE Technicians
		SET AvailabilityStatus = 'Available'
		WHERE TechnicianId = @TechnicianId;
	END;
END;
GO

-- Stored procedure to retrieve client profile details
CREATE PROCEDURE GetClientProfile
    @ClientId INT
AS
BEGIN
    SELECT c.Name, c.Email, c.Phone, c.Address, ct.StartDate, ct.EndDate, ct.ServiceLevel, ct.IsActive
    FROM Clients c
    LEFT JOIN Contracts ct ON c.ClientId = ct.ClientId
    WHERE c.ClientId = @ClientId;
    
    -- Retrieve the client's service request history
    SELECT sr.ServiceRequestId, sr.IssueDescription, sr.Priority, sr.Status, sr.AssignedDate, sr.ResolutionDate
    FROM ServiceRequests sr
    WHERE sr.ClientId = @ClientId;
END;
GO

-- Trigger to automatically set contract status to inactive when contract expires
CREATE TRIGGER trg_ContractExpiry
ON Contracts
AFTER UPDATE
AS
BEGIN
	UPDATE Contracts
	SET IsActive = 0
	WHERE EndDate < GETDATE();
END;
GO

-- Common Table Expression (CTE) to get open service requests with technician details
WITH OpenServiceRequests AS (
	SELECT sr.ServiceRequestId, sr.IssueDescription, sr.Priority, sr.Status,
		t.Name AS TechnicianName, t.SkillSet, t.Location
	FROM ServiceRequests sr
	LEFT JOIN Technicians t ON sr.TechnicianId = t.TechnicianId
	WHERE sr.Status = 'Open'
)
SELECT * FROM OpenServiceRequests;
GO

-- JOIN query to get client service history
SELECT c.Name AS ClientName, c.Email, c.Phone, sr.ServiceRequestId, sr.IssueDescription, sr.Status, sr.ResolutionDate
FROM Clients c
JOIN ServiceRequests sr ON c.ClientId = sr.ClientId
WHERE sr.Status = 'Resolved';
GO
