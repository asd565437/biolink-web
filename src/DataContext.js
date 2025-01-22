import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
// 创建上下文
const DataContext = createContext();

// 提供者组件
export const DataProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/data');
            setData(response.data);
            console.log('Fetched data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addData = async () => {
        if (!name.trim()) {
            console.warn('Name cannot be empty.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/login', { name });
            setData([...data, response.data]);
            setName('');
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };



    return (
        <DataContext.Provider value={{ data, fetchData, addData, name, setName }}>
            {children}
        </DataContext.Provider>
    );
};

// 自定义 Hook，用于方便获取上下文
export const useData = () => useContext(DataContext);
