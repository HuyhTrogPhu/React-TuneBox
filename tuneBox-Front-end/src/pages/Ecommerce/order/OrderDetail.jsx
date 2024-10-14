import React from 'react'
import "../../Ecommerce/order/OrderDetail.css"
const OrderDetail = () => {
    return (
        <div>
            <div className="container">
                <div className="row">
                    {/* BEGIN INVOICE */}
                    <div className="col-xs-12">
                        <div className="grid invoice">
                            <div className="grid-body">
                                <div className="invoice-title">
                                    <div className="row">
                                       
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <h2>Order detail information<br />
                                                <span className="small">#1082</span></h2>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-xs-6">
                                        <address>
                                            <strong>Billed To:</strong><br />
                                            Twitter, Inc.<br />
                                            795 Folsom Ave, Suite 600<br />
                                            San Francisco, CA 94107<br />
                                            <abbr title="Phone">P:</abbr> (123) 456-7890
                                        </address>
                                    </div>
                                    <div className="col-xs-6 text-right1">
                                        <address>
                                            <strong>Shipped To:</strong><br />
                                            Elaine Hernandez<br />
                                            P. Sherman 42,<br />0
                                            Wallaby Way, Sidney<br />
                                            <abbr title="Phone">P:</abbr> (123) 345-6789
                                        </address>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-6">
                                        <address>
                                            <strong>Payment Method:</strong><br />
                                            Visa ending **** 1234<br />
                                            h.elaine@gmail.com<br />
                                        </address>
                                    </div>
                                    <div className="col-xs-6 text-right1">
                                        <address>
                                            <strong>Order Date:</strong><br />
                                            17/06/14
                                        </address>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h3>ORDER SUMMARY</h3>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr className="line">
                                                    <td><strong>#</strong></td>
                                                    <td className="text-center"><strong>PROJECT</strong></td>
                                                    <td className="text-center"><strong>HRS</strong></td>
                                                    <td className="text-right"><strong>RATE</strong></td>
                                                    <td className="text-right"><strong>SUBTOTAL</strong></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td><strong>Template Design</strong><br />A website template is a pre-designed webpage, or set of webpages, that anyone can modify with their own content and images to setup a website.</td>
                                                    <td className="text-center">15</td>
                                                    <td className="text-center">$75</td>
                                                    <td className="text-right">$1,125.00</td>
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td><strong>Template Development</strong><br />Web development is a broad term for the work involved in developing a web site for the Internet (World Wide Web) or an intranet (a private network).</td>
                                                    <td className="text-center">15</td>
                                                    <td className="text-center">$75</td>
                                                    <td className="text-right">$1,125.00</td>
                                                </tr>
                                                <tr className="line">
                                                    <td>3</td>
                                                    <td><strong>Testing</strong><br />Take measures to check the quality, performance, or reliability of (something), especially before putting it into widespread use or practice.</td>
                                                    <td className="text-center">2</td>
                                                    <td className="text-center">$75</td>
                                                    <td className="text-right">$150.00</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={3} />
                                                    <td className="text-right"><strong>Taxes</strong></td>
                                                    <td className="text-right"><strong>N/A</strong></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={3}>
                                                    </td><td className="text-right"><strong>Total</strong></td>
                                                    <td className="text-right"><strong>$2,400.00</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 text-right identity">
                                        <p>Designer identity<br /><strong>Jeffrey Williams</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END INVOICE */}
                </div>
            </div>

        </div>
    )
}

export default OrderDetail