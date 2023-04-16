import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";

import AuthService from "../services/auth.service";
import '../scss/style.scss'
import EventBus from "../common/EventBus";
import {
    CAvatar, CBadge,
    CContainer,
    CDropdown, CDropdownDivider, CDropdownHeader, CDropdownItem, CDropdownMenu,
    CDropdownToggle,
    CHeader,
    CHeaderNav,
    CHeaderToggler,
    CNavItem,
    CNavLink
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilArrowLeft,
    cilBell,
    cilCart,
    cilCommentSquare,
    cilCreditCard, cilEnvelopeOpen,
    cilFile,
    cilList,
    cilLockLocked,
    cilSettings, cilTask,
    cilUser
} from "@coreui/icons";
import {NavLink} from "react-router-dom";


const Navbar = () => {
    const [showPersonalBoard, setShowPersonalBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
            setShowPersonalBoard(user.roles.includes("PERSONAL"));
            setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }

        EventBus.on("logout", () => {
            logOut();
        });

        return () => {
            EventBus.remove("logout");
        };
    }, []);

    const logOut = () => {
        AuthService.logout();
        setShowPersonalBoard(false);
        setShowAdminBoard(false);
        setCurrentUser(undefined);
    };

    return (
        <CHeader position="sticky" className="mb-4">
            <CContainer fluid>
                <CHeaderNav className="d-none d-md-flex me-auto">
                    <CNavItem>
                        <CNavLink to="/home" component={NavLink}>
                            <strong>Managment System</strong>
                        </CNavLink>
                    </CNavItem>
                    {showPersonalBoard &&
                        <CNavItem>
                            <CNavLink to="/addEmployee" component={NavLink}>
                                Add Employee
                            </CNavLink>
                        </CNavItem>
                    }
                    {showPersonalBoard &&
                    <CNavItem>
                        <CNavLink to="/addSchedule" component={NavLink}>
                            Add Schedule
                        </CNavLink>
                    </CNavItem>
                }
                </CHeaderNav>
                <CHeaderNav>

                    <CNavItem>
                        <CNavLink to="/login" component={NavLink} onClick={logOut}>
                            Log Out
                        </CNavLink>
                    </CNavItem>

                </CHeaderNav>
                <CHeaderNav>
                    <CDropdown variant="nav-item">
                        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
                            <CIcon icon={cilList} size="lg"/>
                        </CDropdownToggle>
                        <CDropdownMenu className="pt-0" placement="bottom-end">
                            <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
                            <CDropdownItem href="/profile">
                                <CIcon icon={cilUser} className="me-2" />
                                Profile
                            </CDropdownItem>
                            <CDropdownItem href="/changePassword">

                                    <CIcon icon={cilSettings} className="me-2" />
                                    Password Reset
                                
                            </CDropdownItem>
                            <CDropdownItem href="#">
                                <CIcon icon={cilCreditCard} className="me-2" />
                                Payments
                                <CBadge color="secondary" className="ms-2">
                                    42
                                </CBadge>
                            </CDropdownItem>
                            <CDropdownItem href="#">
                                <CIcon icon={cilFile} className="me-2" />
                                Projects
                                <CBadge color="primary" className="ms-2">
                                    42
                                </CBadge>
                            </CDropdownItem>
                            <CDropdownDivider />
                            <CDropdownItem href="#">
                                <CIcon icon={cilLockLocked} className="me-2" />
                                Lock Account
                            </CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CHeaderNav>

            </CContainer>

        </CHeader>
    );
};

export default Navbar;
