import React, { useEffect, useState } from 'react';
import './Sellwell.css';
import { images } from '../../assets/images/images';
import { Link } from 'react-router-dom';
import { listInstruments } from '../../service/EcommerceHome';

const Sellwell = () => {
    const [instrumentList, setInstrumentList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Số lượng sản phẩm mỗi trang

    useEffect(() => {
        getInstrumentList();
    }, []);

    function getInstrumentList() {
        listInstruments()
            .then((response) => {
                // Lọc các sản phẩm có status là false
                const filteredInstruments = response.data.filter(ins => !ins.status);
                setInstrumentList(filteredInstruments);
                console.log(filteredInstruments);
            })
            .catch((error) => {
                console.error("Error fetching instruments", error);
            });
    }
    const getStockStatus = (quantity) => {
        if (quantity === 0) return 'Out of stock';
        if (quantity > 0 && quantity <= 5) return 'Almost out of stock';
        return 'In stock';
    };

    // Hàm để phân trang và lấy danh sách sản phẩm cho trang hiện tại
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Tính toán các sản phẩm để hiển thị
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = instrumentList.slice(indexOfFirstItem, indexOfLastItem);

    // Tính tổng số trang
    const totalPages = Math.ceil(instrumentList.length / itemsPerPage);

    return (
        <div>
            <div className='mt-5'>
                <div className='sellwell-title'>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <h4 className='title'>Sell well</h4>
                        <Link to={'/Shop'} className='view-all'>View all</Link>
                    </div>
                </div>
                <hr className='hr-100' />

                <div className='row d-flex justify-content-start'>
                    {Array.isArray(instrumentList) && instrumentList.length > 0 ? (
                        currentItems.map((ins) => {
                            return (
                                <div key={ins.id} className='col-3 mb-4'>  {/* Add the key here */}
                                    <div className='card'>
                                        <Link to={{
                                            pathname: `/DetailProduct/${ins.id}`,
                                            state: { ins }
                                        }}>
                                            <div style={{ width: '100%', height: '100%', border: 'none', cursor: 'pointer' }}>
                                                <div className='card-img-wrapper ' style={{ height: '250px' }}>
                                                    <img
                                                        src={ins.image ? ins.image : 'default-image-path.jpg'}
                                                        alt={ins.name}
                                                    />
                                                </div>
                                                <div className='card-body text-center'>
                                                    <h5 className='card-title'>
                                                        {ins.name}
                                                    </h5>
                                                    <p className='card-price'>
                                                        {ins.costPrice.toLocaleString('vi')}đ
                                                    </p>
                                                    <p className="card-status">{getStockStatus(ins.quantity)}</p>
                                                </div>
                                            </div>

                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='alert alert-danger'>No instrument available</div>
                    )}


                    {/* Phân trang */}
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
    );
}

export default Sellwell;
