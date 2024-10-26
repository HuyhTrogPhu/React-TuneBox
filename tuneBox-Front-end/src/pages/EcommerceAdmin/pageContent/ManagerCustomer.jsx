import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { listEcommerceUsers } from '../../../service/EcommerceAdminUser';
import { Link } from 'react-router-dom';



const ManagerCustomer = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [province, setProvince] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [amountFrom, setAmountFrom] = useState('');
    const [amountTo, setAmountTo] = useState('');
    const [countFrom, setCountFrom] = useState('');
    const [countTo, setCountTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const rowsPerPage = 7;

    useEffect(() => {
        fetchUsers();
        fetchProvinces();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await listEcommerceUsers();
            setUsers(response.data);
            setFilteredUsers(response.data); // Initially set full list
            setTotalPages(Math.ceil(response.data.length / rowsPerPage)); // Calculate total pages
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await axios.get('/api/city');
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch provinces:", error);
        }
    };

    useEffect(() => {
        fetchProvinces();
    }, []);


    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
        filterUsers(e.target.value, province, amountFrom, amountTo, countFrom, countTo);
    };

    const handleProvinceChange = (e) => {
        setProvince(e.target.value);
        filterUsers(keyword, e.target.value, amountFrom, amountTo, countFrom, countTo);
    };

    const handleAmountChange = (from, to) => {
        setAmountFrom(from);
        setAmountTo(to);
        filterUsers(keyword, province, from, to, countFrom, countTo);
    };

    const handleCountChange = (from, to) => {
        setCountFrom(from);
        setCountTo(to);
        filterUsers(keyword, province, amountFrom, amountTo, from, to);
    };

    const filterUsers = (searchKeyword, searchProvince, fromAmount, toAmount, fromCount, toCount) => {
        let filtered = users;
        if (searchKeyword) {
            filtered = filtered.filter(user =>
                user.username.includes(searchKeyword) || user.email.includes(searchKeyword)
            );
        }
        if (searchProvince) {
            filtered = filtered.filter(user => user.province === searchProvince);
        }
        if (fromAmount && toAmount) {
            filtered = filtered.filter(user => user.totalOrderAmount >= fromAmount && user.totalOrderAmount <= toAmount);
        }
        if (fromCount && toCount) {
            filtered = filtered.filter(user => user.totalOrderCount >= fromCount && user.totalOrderCount <= toCount);
        }
        setFilteredUsers(filtered);
        setTotalPages(Math.ceil(filtered.length / rowsPerPage)); // Recalculate total pages after filtering
    };

    const paginateUsers = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    };

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div>
            {/* Main content */}
            <div className='container-fluid'>
                <div className='row'>
                    {/* Search by keyword */}
                    <div className='col-4'>
                        <form action="">
                            <div className='mt-3'>
                                <label className='form-label'>Search by keyword:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by username or email"
                                    value={keyword}
                                    onChange={handleKeywordChange}
                                />
                            </div>
                        </form>
                    </div>
                    {/* Search by province */}
                    <div className='col-2'>
                        <form action="">
                            <div className='mt-3'>
                                <label className='form-label'>Search by province:</label>
                                <select className="form-select mt-2" value={province} onChange={handleProvinceChange}>
                                    <option value="">Choose...</option>
                                    {provinces.map((prov) => (
                                        <option key={prov.ID} value={prov.Title}>
                                            {prov.Title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </div>
                    {/* Total price filter */}
                    <div className='col-3'>
                        <form>
                            <div className="mt-3">
                                <label className="form-label">Total order amount:</label>
                                <div className='d-flex'>
                                    <input
                                        type="number"
                                        className='form-control'
                                        placeholder='From'
                                        value={amountFrom}
                                        onChange={(e) => handleAmountChange(e.target.value, amountTo)}
                                    />
                                    -
                                    <input
                                        type="number"
                                        className='form-control'
                                        placeholder='To'
                                        value={amountTo}
                                        onChange={(e) => handleAmountChange(amountFrom, e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* Total order count filter */}
                    <div className='col-3'>
                        <form>
                            <div className="mt-3">
                                <label className="form-label">Total order count:</label>
                                <div className='d-flex'>
                                    <input
                                        type="number"
                                        className='form-control'
                                        placeholder='From'
                                        value={countFrom}
                                        onChange={(e) => handleCountChange(e.target.value, countTo)}
                                    />
                                    -
                                    <input
                                        type="number"
                                        className='form-control'
                                        placeholder='To'
                                        value={countTo}
                                        onChange={(e) => handleCountChange(countFrom, e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div className='row mt-5'>
                    <div className='col-12'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>Username</th>
                                    <th scope='col'>Email</th>
                                    <th scope='col'>location</th>
                                    <th scope='col'>Total order amount</th>
                                    <th scope='col'>Total order count</th>
                                    <th scope='col'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginateUsers().map((user, index) => (
                                    <tr key={user.id}>
                                        <th scope='row'>{index + 1 + (currentPage - 1) * rowsPerPage}</th>
                                        <td>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td>location</td>
                                        <td>{(user.totalOrderAmount).toLocaleString('vi')} VND</td>
                                        <td>{user.totalOrderCount} order</td>
                                        <td>
                                        <Link className='btn btn-primary' style={{ color: '#000' }} to={`/ecomadmin/Customer/detail/${user.id}`}>View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center text-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage - 1)} aria-label="Previous">
                                            <span aria-hidden="true">«</span>
                                        </button>
                                    </li>
                                    {[...Array(totalPages).keys()].map(number => (
                                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                            <button onClick={() => paginate(number + 1)} className="page-link">
                                                {number + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage + 1)} aria-label="Next">
                                            <span aria-hidden="true">»</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerCustomer;
