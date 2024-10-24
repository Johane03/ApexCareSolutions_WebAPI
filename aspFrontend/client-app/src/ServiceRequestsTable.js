import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceRequestsTable.css';

const ServiceRequestsTable = () => {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    
    useEffect(() => {
        axios.get(`https://localhost:7075/api/ServiceRequest`)
            .then(response => {
                console.log(response.data); 
                // Filter out requests with status 'Complete'
                const filteredRequests = response.data.filter(request => request.status !== 'Complete');
                setServiceRequests(filteredRequests);
            })
            .catch(error => {
                console.error('There was an error fetching the service requests!', error);
            });
    }, []);

    const handleServiceRequestClick = (clientId) => {
        axios.get(`https://localhost:7075/api/Clients/${clientId}`)
            .then(response => {
                setSelectedClient(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the client details!', error);
            });
    };

    const sendSms = async (phoneNumber, message) => {
        try {
            const response = await axios.post(`https://localhost:7075/api/ServiceRequest/send-sms?phoneNumber=${encodeURIComponent(phoneNumber)}&message=${encodeURIComponent(message)}`);
            console.log(response.data);
        } catch (error) {
            console.error('Error sending SMS:', error);
        }
    };

    return (
        <div>
            <h2 id='serviceRequestsHeading'>Service Requests</h2>
            <table id='serviceRequests'>
                <thead>
                    <tr>
                        <th>Service Request ID</th>
                        <th>Issue Description</th>
                        <th>Status</th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    {serviceRequests.length > 0 ? (
                        serviceRequests.map(request => (
                            <tr key={request.serviceRequestId} onClick={() => handleServiceRequestClick(request.clientId)}>
                                <td>{request.serviceRequestId}</td>
                                <td>{request.issueDescription}</td>
                                <td>{request.status}</td>
                                <td>{request.priority}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No service requests available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedClient && (
                <div>
                    <h2 id='clientDetailsHeading'>Client Details</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td className='clientDetails'>Name:</td>
                                <td>{selectedClient.name}</td>
                            </tr>
                            <tr>
                                <td className='clientDetails'>Email:</td>
                                <td>{selectedClient.email}</td>
                            </tr>
                            <tr>
                                <td className='clientDetails'>Phone:</td>
                                <td>{selectedClient.phone}</td>
                            </tr>
                            <tr>
                                <td className='clientDetails'>Address:</td>
                                <td>{selectedClient.address}</td>
                            </tr>
                        </tbody>
                    </table>
                  
                    <form className='sendDetails'>
                        <h2 id='sendDetailsHeading'>Send Details to Technician</h2>
                        
                        <input id='phoneNumber' placeholder='Enter Phone Number' />
                        <input id='message' placeholder='Enter Message' />
                        <button type="button" onClick={() => {
                                const phoneNumber = document.getElementById('phoneNumber')
                                const phoneNumberValue = phoneNumber.value
                                const message = document.getElementById('message')
                                const messageValue = message.value
                                try {
                                    sendSms(phoneNumberValue, messageValue);
                                    alert('Message sent successfully!');
                                } catch (err) {
                                    alert('Error sending message');
                                }
                            }}
                        >
                            Send Message
                        </button>
                    </form>
                    <br />
                </div>
            )}
        </div>
    );
};

export default ServiceRequestsTable;
