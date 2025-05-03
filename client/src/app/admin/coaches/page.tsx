"use client"

import React, { useEffect, useState } from 'react';
import { coachService } from '@/services/api';
import Navbar from '@/components/Navbar';

interface Coach {
    id: string;
    name: string;
    email: string;
    group: string;
}

const CoachesPage = () => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [newCoach, setNewCoach] = useState({
        name: '',
        email: '',
        group: ''
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [temporaryPassword, setTemporaryPassword] = useState('');
    const [showPasswordAlert, setShowPasswordAlert] = useState(false);

    useEffect(() => {
        fetchCoaches();
    }, []);

    const fetchCoaches = async () => {
        try {
            const data = await coachService.getAllCoaches();
            setCoaches(data);
        } catch (error) {
            console.error('Error fetching coaches:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewCoach({ ...newCoach, [name]: value });
    };

    const handleAddCoach = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await coachService.addCoach(newCoach);
            if (response && response.temporaryPassword) {
                setTemporaryPassword(response.temporaryPassword);
                setShowPasswordAlert(true);
            }
            fetchCoaches();
            setNewCoach({
                name: '',
                email: '',
                group: ''
            });
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error adding coach:', error);
        }
    };

    const closePasswordAlert = () => {
        setShowPasswordAlert(false);
        setTemporaryPassword('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {showPasswordAlert && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Coach Added Successfully!</strong>
                        <p className="block sm:inline ml-2">
                            Temporary Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{temporaryPassword}</span>
                        </p>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <button onClick={closePasswordAlert}>
                                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <title>Close</title>
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                </svg>
                            </button>
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Coach Management</h1>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                    >
                        {isFormOpen ? 'Cancel' : 'Add New Coach'}
                    </button>
                </div>

                {isFormOpen && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Coach</h2>
                        <form onSubmit={handleAddCoach} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newCoach.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newCoach.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                                <input
                                    type="text"
                                    name="group"
                                    value={newCoach.group}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow"
                                >
                                    Save Coach
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Group</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {coaches.length > 0 ? (
                                    coaches.map((coach) => (
                                        <tr key={coach.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-500">{coach.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{coach.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{coach.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{coach.group}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                    Edit
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No coaches found. Add your first coach to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachesPage;