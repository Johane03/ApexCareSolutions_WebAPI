import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceRequestsTable.css';

const ServiceRequestsTable = () => {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editRequest, setEditRequest] = useState(null);
    const [newDetails, setNewDetails] = useState({ issueDescription: '', status: '', priority: '' });

    useEffect(() => {
        axios.get(`https://localhost:7075/api/ServiceRequest`)
            .then(response => {
                const filteredRequests = response.data.filter(request => request.status === 'Complete');
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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleEdit = (request) => {
        setEditRequest(request);
        setNewDetails({ issueDescription: request.issueDescription, status: request.status, priority: request.priority });
    };

    const handleUpdate = () => {
        event.preventDefault();
        // Fetch the existing data before updating
        axios.get(`https://localhost:7075/api/ServiceRequest/${editRequest.serviceRequestId}`)
            .then(response => {
                const existingRequest = response.data;

                // Merge existing data with the new details
                const updatedRequest = {
                    ...existingRequest,
                    issueDescription: newDetails.issueDescription,
                    status: newDetails.status,
                    priority: newDetails.priority
                };

                return axios.put(`https://localhost:7075/api/ServiceRequest/${editRequest.serviceRequestId}`, updatedRequest);
            })
            .then(response => {
                alert('Update successful:', response.data);
                setServiceRequests(prev =>
                    prev.map(request => request.serviceRequestId === editRequest.serviceRequestId ? { ...request, ...newDetails } : request)
                );
                setEditRequest(null);
            })
            .catch(error => {
                console.error('There was an error updating the record!', error.response ? error.response.data : error.message);
                alert('There was an error updating the record!', error);
            });
    };

    const filteredRequests = serviceRequests.filter(request => 
        request.issueDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2 id='serviceRequestsHeading'>Service Requests</h2>
            <input id='searchBox'
                type="text" 
                placeholder="Search by issue description" 
                value={searchTerm} 
                onChange={handleSearchChange} 
            />
            <table id='serviceRequests'>
                <thead>
                    <tr>
                        <th>Service Request ID</th>
                        <th>Issue Description</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(request => (
                            <tr key={request.serviceRequestId} onClick={() => handleServiceRequestClick(request.clientId)}>
                                <td>{request.serviceRequestId}</td>
                                <td>{request.issueDescription}</td>
                                <td>{request.status}</td>
                                <td>{request.priority}</td>
                                <td>
                                    <button id='actionButton' onClick={() => handleEdit(request)}>Edit</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No service requests available.</td>
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
    
                    <br />
                </div>
            )}

            {editRequest && (
                <form className='editDetails'>
                    <h2 id='editDetailsHeading'>Edit Service Request</h2>
                    <label><h3>Issue Description:</h3></label>
                    <input 
                        type="text" 
                        placeholder="Issue Description" 
                        value={newDetails.issueDescription} 
                        onChange={(e) => setNewDetails({ ...newDetails, issueDescription: e.target.value })} 
                    />

                    <label><h3>Status:</h3></label>
                    <input 
                        type="text" 
                        placeholder="Status" 
                        value={newDetails.status} 
                        onChange={(e) => setNewDetails({ ...newDetails, status: e.target.value })} 
                    />

                    <label><h3>Priority:</h3></label>
                    <input 
                        type="text" 
                        placeholder="Priority" 
                        value={newDetails.priority} 
                        onChange={(e) => setNewDetails({ ...newDetails, priority: e.target.value })} 
                    />
                    
                    <div className='buttonContainer'>
                        <button type="button" onClick={handleUpdate}>Update</button>
                        <button type="button" onClick={() => setEditRequest(null)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ServiceRequestsTable;
