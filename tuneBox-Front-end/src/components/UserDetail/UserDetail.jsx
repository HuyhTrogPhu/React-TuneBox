import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEcommerceUserDetails } from '../../service/EcommerceAdminUser';
import { getOrderByUserId } from '../../service/EcommerceAdminOrder';
import { images } from '../../assets/images/images';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas-pro';
import { Link } from 'react-router-dom';

const UserDetail = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState({});
    const [orderList, setOrderList] = useState([]);
    const [totalOrderCount, setTotalOrderCount] = useState(0);
    const [totalOrderAmount, setTotalOrderAmount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Tính tổng số trang dựa trên danh sách đơn hàng
    const totalItems = orderList.length; // Số lượng đơn hàng
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    useEffect(() => {
        // Fetch chi tiết người dùng
        const fetchUserDetails = async () => {
            try {
                const response = await getEcommerceUserDetails(userId);
                setUserDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };

        // Fetch danh sách đơn hàng
        const fetchUserOrders = async () => {
            try {
                const response = await getOrderByUserId(userId);
                setOrderList(response.data);

                // Tính tổng số đơn hàng và tổng giá trị đơn hàng
                const totalOrders = response.data.length;
                const totalAmount = response.data.reduce((acc, order) => acc + order.totalPrice, 0);

                setTotalOrderCount(totalOrders);
                setTotalOrderAmount(totalAmount);
            } catch (error) {
                console.error('Failed to fetch order list:', error);
            }
        };

        fetchUserDetails();
        fetchUserOrders();
    }, [userId]);

    // Hàm xuất Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(orderList.map(order => ({
            'Order Date': new Date(order.orderDate).toLocaleDateString('vi'),
            'Delivery Date': order.deliveryDate || '',
            'Total Price': (order.totalPrice).toLocaleString('vi') + ' VND',
            'Total Items': order.totalItem,
            'Payment Method': order.paymentMethod,
            'Status': order.status,
            'Shipping Method': order.shippingMethod
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

        // Tạo tên file dựa trên tên người dùng
        const fileName = `OrderDetailUser_${userDetails.name || 'Unknown'}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    const downloadPDF = async () => {
        const input = document.getElementById('orderHistory');
        const canvas = await html2canvas(input, { useCORS: true }); // Thêm useCORS: true
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`OrderHistory_${userDetails.name}.pdf`);
    };


    return (
        <div style={{ backgroundColor: 'white', padding: '50px' }}>
            <div className='container' id='orderHistory' >
                <div className='row'>
                    {/* Thông tin chi tiết người dùng */}
                    <div className='col-4' style={{ position: 'relative' }} >

                        {/* Thông tin chi tiết người dùng */}
                        <div className='infor' style={{ position: 'absolute', top: '500px', left: '150px', transform: 'translate(-50%, -50%)' }}>

                            <div style={{ textAlign: 'center' }}>
                                <img src={userDetails.avatar || 'default_avatar.jpg'} alt="Avatar" style={{ width: '200px', borderRadius: '50%' }} />
                            </div>

                            <div className="card mb-lg-0" style={{ marginTop: '50px' }}>
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush rounded-3">
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <p className="mb-0"><b>  Name:</b> {userDetails.name || 'Chưa cập nhật'}  </p>

                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <p className="mb-0"><b>Username:</b> {userDetails.userName || 'Chưa cập nhật'}  </p>

                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <p className="mb-0"> <b>Gender: </b> {userDetails.gender || 'Chưa cập nhật'} </p>

                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <p className="mb-0">
                                                <b>Birthday:</b> {userDetails.birthday
                                                    ? new Date(userDetails.birthday).toISOString().split('T')[0]
                                                    : 'Chưa cập nhật'}
                                            </p>
                                        </li>

                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <p className="mb-0"><b>Email:</b> {userDetails.email || 'Chưa cập nhật'}  </p>

                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <p className="mb-0"><b>Phone number:</b> {userDetails.phoneNumber || 'Chưa cập nhật'} </p>

                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <p className="mb-0"><b>Location:</b> {userDetails.location || 'Chưa cập nhật'} </p>

                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <p className="mb-0"><b>About:</b> {userDetails.about || 'Chưa cập nhật'} </p>

                                        </li>
                                    </ul>
                                </div>
                            </div>


                        </div>

                    </div>

                    {/* Lịch sử đơn hàng */}
                    <div className='col-8 mt-5'  >
                        <h3 style={{ textAlign: 'center', fontWeight: '1000' }}>ORDER HISTORY</h3>
                        <p>Total order: <strong>{totalOrderCount}</strong></p>
                        <p>Total order amount: <strong>{totalOrderAmount.toLocaleString('vi')} VND</strong></p>
                        <button className="btn btn-success mb-3 me-2" onClick={exportToExcel}>Xuất Excel</button>
                        <button onClick={downloadPDF} className="btn mb-3 btn-danger">Download PDF</button>
                        <table className='table table-hover' style={{ border: '2px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
                            <thead style={{ backgroundColor: '#f5f5f5' }}>
                                <tr>
                                    <th style={{ fontSize: '15px', textAlign: "center" }} scope="col">#</th>
                                    <th style={{ fontSize: '15px', textAlign: "center" }} scope="col">Order date</th>
                                    <th style={{ fontSize: '15px', textAlign: "center" }} scope="col">Delivery date</th>
                                    <th style={{ fontSize: '15px', textAlign: "center" }} scope="col">Total Price</th>
                                    <th style={{ fontSize: '15px', textAlign: "center" }} scope="col">Total Items</th>
                                    <th style={{ fontSize: '15px', textAlign: "center" }} scope="col">Payment method</th>
                                    <th style={{ fontSize: '15px', textAlign: "center" }} scope="col">Status</th>
                                    <th style={{ fontSize: '15px', textAlign: "center" }} scope="col">Shipping method</th>
                                    <th style={{ fontSize: '15px', textAlign: "center" }} h scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderList
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) // Lọc dữ liệu dựa trên trang hiện tại
                                    .map((order, index) => (
                                        <tr key={order.id}>
                                            <th style={{ textAlign: "center" }} scope="row">
                                                {(currentPage - 1) * itemsPerPage + index + 1} {/* Đánh số thứ tự */}
                                            </th>
                                            <td>{new Date(order.orderDate).toLocaleDateString('vi')}</td>
                                            <td>{order.deliveryDate || ''}</td>
                                            <td>{(order.totalPrice).toLocaleString('vi')} VND</td>
                                            <td>{order.totalItem}</td>
                                            <td>{order.paymentMethod}</td>
                                            <td>{order.status}</td>
                                            <td>{order.shippingMethod}</td>
                                            <td>
                                                <Link to={`/ecomadmin/order/detail/${order.id}`}>View</Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>

                        </table>

                        {/* Pagination */}
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-center">
                                {/* Nút trang đầu tiên */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(1)} aria-label="First">
                                        <span aria-hidden="true">««</span>
                                    </button>
                                </li>
                                {/* Nút quay lại */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage - 1)} aria-label="Previous">
                                        <span aria-hidden="true">«</span>
                                    </button>
                                </li>
                                {/* Các trang số */}
                                {
                                    [...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        // Hiển thị các trang liền kề hoặc trang đầu/cuối
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                                        ) {
                                            return (
                                                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => paginate(pageNumber)}>
                                                        {pageNumber}
                                                    </button>
                                                </li>
                                            );
                                        }
                                        // Thêm dấu "..." cho khoảng cách lớn
                                        if (
                                            (pageNumber === currentPage - 3 && pageNumber > 1) ||
                                            (pageNumber === currentPage + 3 && pageNumber < totalPages)
                                        ) {
                                            return (
                                                <li key={`ellipsis-${pageNumber}`} className="page-item disabled">
                                                    <span className="page-link">...</span>
                                                </li>
                                            );
                                        }

                                        return null;
                                    })
                                }
                                {/* Nút tiếp theo */}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage + 1)} aria-label="Next">
                                        <span aria-hidden="true">»</span>
                                    </button>
                                </li>
                                {/* Nút trang cuối */}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(totalPages)} aria-label="Last">
                                        <span aria-hidden="true">»»</span>
                                    </button>
                                </li>
                            </ul>
                            {/* Hiển thị trạng thái phân trang */}
                            <p className="text-center mt-2">Page {currentPage} of {totalPages}</p>
                        </nav>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
