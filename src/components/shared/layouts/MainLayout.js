import React from 'react';
import LeftMenu from "./../LeftMenu";

export default class MainLayout extends React.Component
{
    render()
    {
        return (
            <section id="container">
                <header className="header fixed-top clearfix">
                    <div className="brand">
                        <a href="index-2.html" className="logo">
                            <img src="images/logo.png" alt="" />
                        </a>
                        <div className="sidebar-toggle-box">
                            <div className="fa fa-bars"></div>
                        </div>
                    </div>
                    <div className="nav notify-row" id="top_menu">
                        <ul className="nav top-menu">
                            <li className="dropdown">
                                <a data-toggle="dropdown" className="dropdown-toggle" href="{#}">
                                    <i className="fa fa-tasks"></i>
                                    <span className="badge bg-success">8</span>
                                </a>
                                <ul className="dropdown-menu extended tasks-bar">
                                    <li>
                                        <p className="">You have 8 pending tasks</p>
                                    </li>
                                    <li>
                                        <a href="{#}">
                                            <div className="task-info clearfix">
                                                <div className="desc pull-left">
                                                    <h5>Target Sell</h5>
                                                    <p>25% , Deadline  12 June’13</p>
                                                </div>
                                                <span className="notification-pie-chart float-right" data-percent="45">
                                                    <span className="percent"></span>
                                                </span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="{#}">
                                            <div className="task-info clearfix">
                                                <div className="desc pull-left">
                                                    <h5>Product Delivery</h5>
                                                    <p>45% , Deadline  12 June’13</p>
                                                </div>
                                                <span className="notification-pie-chart float-right" data-percent="78">
                                                    <span className="percent"></span>
                                                </span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="{#}">
                                            <div className="task-info clearfix">
                                                <div className="desc pull-left">
                                                    <h5>Payment collection</h5>
                                                    <p>87% , Deadline  12 June’13</p>
                                                </div>
                                                <span className="notification-pie-chart float-right" data-percent="60">
                                                    <span className="percent"></span>
                                                </span>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="{#}">
                                            <div className="task-info clearfix">
                                                <div className="desc pull-left">
                                                    <h5>Target Sell</h5>
                                                    <p>33% , Deadline  12 June’13</p>
                                                </div>
                                                <span className="notification-pie-chart float-right" data-percent="90">
                                                    <span className="percent"></span>
                                                </span>
                                            </div>
                                        </a>
                                    </li>

                                    <li className="external">
                                        <a href="{#}">See All Tasks</a>
                                    </li>
                                </ul>
                            </li>

                            <li id="header_inbox_bar" className="dropdown">
                                <a data-toggle="dropdown" className="dropdown-toggle" href="{#}">
                                    <i className="fa fa-envelope-o"></i>
                                    <span className="badge bg-important">4</span>
                                </a>
                                <ul className="dropdown-menu extended inbox">
                                    <li>
                                        <p className="red">You have 4 Mails</p>
                                    </li>
                                    <li>
                                        <a href="{#}">
                                            <span className="photo"><img alt="avatar" src="images/avatar-mini.jpg" /></span>
                                            <span className="subject">
                                                <span className="from">Jonathan Smith</span>
                                                <span className="time">Just now</span>
                                            </span>
                                            <span className="message">
                                                Hello, this is an example msg.
                        </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="{#}">
                                            <span className="photo"><img alt="avatar" src="images/avatar-mini-2.jpg" /></span>
                                            <span className="subject">
                                                <span className="from">Jane Doe</span>
                                                <span className="time">2 min ago</span>
                                            </span>
                                            <span className="message">
                                                Nice admin template
                        </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="{#}">
                                            <span className="photo"><img alt="avatar" src="images/avatar-mini-3.jpg" /></span>
                                            <span className="subject">
                                                <span className="from">Tasi sam</span>
                                                <span className="time">2 days ago</span>
                                            </span>
                                            <span className="message">
                                                This is an example msg.
                        </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="{#}">
                                            <span className="photo"><img alt="avatar" src="images/avatar-mini.jpg" /></span>
                                            <span className="subject">
                                                <span className="from">Mr. Perfect</span>
                                                <span className="time">2 hour ago</span>
                                            </span>
                                            <span className="message">
                                                Hi there, its a test
                        </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="{#}">See all messages</a>
                                    </li>
                                </ul>
                            </li>

                            <li id="header_notification_bar" className="dropdown">
                                <a data-toggle="dropdown" className="dropdown-toggle" href="{#}">

                                    <i className="fa fa-bell-o"></i>
                                    <span className="badge bg-warning">3</span>
                                </a>
                                <ul className="dropdown-menu extended notification">
                                    <li>
                                        <p>Notifications</p>
                                    </li>
                                    <li>
                                        <div className="alert alert-info clearfix">
                                            <span className="alert-icon"><i className="fa fa-bolt"></i></span>
                                            <div className="noti-info">
                                                <a href="{#}"> Server #1 overloaded.</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="alert alert-danger clearfix">
                                            <span className="alert-icon"><i className="fa fa-bolt"></i></span>
                                            <div className="noti-info">
                                                <a href="{#}"> Server #2 overloaded.</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="alert alert-success clearfix">
                                            <span className="alert-icon"><i className="fa fa-bolt"></i></span>
                                            <div className="noti-info">
                                                <a href="{#}"> Server #3 overloaded.</a>
                                            </div>
                                        </div>
                                    </li>

                                </ul>
                            </li>

                        </ul>
                    </div>
                    <div className="top-nav clearfix">

                        <ul className="nav float-right top-menu">
                            <li>
                                <input type="text" className="form-control search" placeholder=" Search" />
                            </li>

                            <li className="dropdown">
                                <a data-toggle="dropdown" className="dropdown-toggle icon-user" href="{#}">

                                    <img alt="" src="images/avatar1_small.jpg" />
                                    <i className="fa fa-user"></i>
                                    <span className="username">John Doe</span>
                                    <b className="caret"></b>
                                </a>
                                <ul className="dropdown-menu extended logout">
                                    <li><a href="{#}"><i className=" fa fa-suitcase"></i>Profile</a></li>
                                    <li><a href="{#}"><i className="fa fa-cog"></i> Settings</a></li>
                                    <li><a href="login.html"><i className="fa fa-key"></i> Log Out</a></li>
                                </ul>
                            </li>

                            <li>
                                <div className="toggle-right-box">
                                    <div className="fa fa-bars"></div>
                                </div>
                            </li>
                        </ul>

                    </div>
                </header>
                <LeftMenu />
                <section id="main-content">
                    <section className="wrapper">

                        <div className="row">
                            <div className="col-sm-12">
                                <div id="toast"></div>
                                <div id="messages"></div>
                                {this.props.children}
                            </div>
                        </div>
                    </section>
                </section>

                <div className="right-sidebar">
                    <div className="search-row">
                        <input type="text" placeholder="Search" className="form-control" />
                    </div>
                    <div className="right-stat-bar">
                        <ul className="right-side-accordion">
                            <li className="widget-collapsible">
                                <a href="{#}" className="head widget-head red-bg active clearfix">
                                    <span className="pull-left">work progress (5)</span>
                                    <span className="float-right widget-collapse"><i className="ico-minus"></i></span>
                                </a>
                                <ul className="widget-container">
                                    <li>
                                        <div className="prog-row side-mini-stat clearfix">
                                            <div className="side-graph-info">
                                                <h4>Target sell</h4>
                                                <p>
                                                    25%, Deadline 12 june 13
            </p>
                                            </div>
                                            <div className="side-mini-graph">
                                                <div className="target-sell">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="prog-row side-mini-stat">
                                            <div className="side-graph-info">
                                                <h4>product delivery</h4>
                                                <p>
                                                    55%, Deadline 12 june 13
            </p>
                                            </div>
                                            <div className="side-mini-graph">
                                                <div className="p-delivery">
                                                    <div className="sparkline" data-type="bar" data-resize="true" data-height="30" data-width="90%" data-bar-color="#39b7ab" data-bar-width="5" data-data="[200,135,667,333,526,996,564,123,890,564,455]">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="prog-row side-mini-stat">
                                            <div className="side-graph-info payment-info">
                                                <h4>payment collection</h4>
                                                <p>
                                                    25%, Deadline 12 june 13
            </p>
                                            </div>
                                            <div className="side-mini-graph">
                                                <div className="p-collection">
                                                    <span className="pc-epie-chart" data-percent="45">
                                                        <span className="percent"></span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="prog-row side-mini-stat">
                                            <div className="side-graph-info">
                                                <h4>delivery pending</h4>
                                                <p>
                                                    44%, Deadline 12 june 13
            </p>
                                            </div>
                                            <div className="side-mini-graph">
                                                <div className="d-pending">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="prog-row side-mini-stat">
                                            <div className="col-md-12">
                                                <h4>total progress</h4>
                                                <p>
                                                    50%, Deadline 12 june 13
            </p>
                                                <div className="progress progress-xs mtop10">
                                                    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="20" role="progressbar" className="progress-bar progress-bar-info">
                                                        <span className="sr-only">50% Complete</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            <li className="widget-collapsible">
                                <a href="{#}" className="head widget-head terques-bg active clearfix">
                                    <span className="pull-left">contact online (5)</span>
                                    <span className="float-right widget-collapse"><i className="ico-minus"></i></span>
                                </a>
                                <ul className="widget-container">
                                    <li>
                                        <div className="prog-row">
                                            <div className="user-thumb">
                                                <a href="{#}"><img src=" images/avatar1_small.jpg" alt="" /></a>
                                            </div>
                                            <div className="user-details">
                                                <h4><a href="{#}">Jonathan Smith</a></h4>
                                                <p>
                                                    Work for fun
            </p>
                                            </div>
                                            <div className="user-status text-danger">
                                                <i className="fa fa-comments-o"></i>
                                            </div>
                                        </div>
                                        <div className="prog-row">
                                            <div className="user-thumb">
                                                <a href="{#}"><img src="images/avatar1.jpg" alt="" /></a>
                                            </div>
                                            <div className="user-details">
                                                <h4><a href="{#}">Anjelina Joe</a></h4>
                                                <p>
                                                    Available
            </p>
                                            </div>
                                            <div className="user-status text-success">
                                                <i className="fa fa-comments-o"></i>
                                            </div>
                                        </div>
                                        <div className="prog-row">
                                            <div className="user-thumb">
                                                <a href="{#}"><img src="images/chat-avatar2.jpg" alt="" /></a>
                                            </div>
                                            <div className="user-details">
                                                <h4><a href="{#}">John Doe</a></h4>
                                                <p>
                                                    Away from Desk
            </p>
                                            </div>
                                            <div className="user-status text-warning">
                                                <i className="fa fa-comments-o"></i>
                                            </div>
                                        </div>
                                        <div className="prog-row">
                                            <div className="user-thumb">
                                                <a href="{#}"><img src="images/avatar1_small.jpg" alt="" /></a>
                                            </div>
                                            <div className="user-details">
                                                <h4><a href="{#}">Mark Henry</a></h4>
                                                <p>
                                                    working
            </p>
                                            </div>
                                            <div className="user-status text-info">
                                                <i className="fa fa-comments-o"></i>
                                            </div>
                                        </div>
                                        <div className="prog-row">
                                            <div className="user-thumb">
                                                <a href="{#}"><img src="images/avatar1.jpg" alt="" /></a>
                                            </div>
                                            <div className="user-details">
                                                <h4><a href="{#}">Shila Jones</a></h4>
                                                <p>
                                                    Work for fun
            </p>
                                            </div>
                                            <div className="user-status text-danger">
                                                <i className="fa fa-comments-o"></i>
                                            </div>
                                        </div>
                                        <p className="text-center">
                                            <a href="{#}" className="view-btn">View all Contacts</a>
                                        </p>
                                    </li>
                                </ul>
                            </li>
                            <li className="widget-collapsible">
                                <a href="{#}" className="head widget-head purple-bg active">
                                    <span className="pull-left"> recent activity (3)</span>
                                    <span className="float-right widget-collapse"><i className="ico-minus"></i></span>
                                </a>
                                <ul className="widget-container">
                                    <li>
                                        <div className="prog-row">
                                            <div className="user-thumb rsn-activity">
                                                <i className="fa fa-clock-o"></i>
                                            </div>
                                            <div className="rsn-details ">
                                                <p className="text-muted">
                                                    just now
            </p>
                                                <p>
                                                    <a href="{#}">Jim Doe </a>Purchased new equipments for zonal office setup
            </p>
                                            </div>
                                        </div>
                                        <div className="prog-row">
                                            <div className="user-thumb rsn-activity">
                                                <i className="fa fa-clock-o"></i>
                                            </div>
                                            <div className="rsn-details ">
                                                <p className="text-muted">
                                                    2 min ago
            </p>
                                                <p>
                                                    <a href="{#}">Jane Doe </a>Purchased new equipments for zonal office setup
            </p>
                                            </div>
                                        </div>
                                        <div className="prog-row">
                                            <div className="user-thumb rsn-activity">
                                                <i className="fa fa-clock-o"></i>
                                            </div>
                                            <div className="rsn-details ">
                                                <p className="text-muted">
                                                    1 day ago
            </p>
                                                <p>
                                                    <a href="{#}">Jim Doe </a>Purchased new equipments for zonal office setup
            </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            <li className="widget-collapsible">
                                <a href="{#}" className="head widget-head yellow-bg active">
                                    <span className="pull-left"> shipment status</span>
                                    <span className="float-right widget-collapse"><i className="ico-minus"></i></span>
                                </a>
                                <ul className="widget-container">
                                    <li>
                                        <div className="col-md-12">
                                            <div className="prog-row">
                                                <p>
                                                    Full sleeve baby wear (SL: 17665)
            </p>
                                                <div className="progress progress-xs mtop10">
                                                    <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                        <span className="sr-only">40% Complete</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="prog-row">
                                                <p>
                                                    Full sleeve baby wear (SL: 17665)
            </p>
                                                <div className="progress progress-xs mtop10">
                                                    <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                        <span className="sr-only">70% Completed</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>

            </section>
        )
    }
}