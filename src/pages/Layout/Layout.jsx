import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Modal from '../../components/Modal/Modal';
import RegisterUser from '../../components/RegisterUser/RegisterUser';
import ScrollToTop from '../../utils/ScrollToTop';

function Layout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <ScrollToTop />
      <Header openRegisterModal={() => setIsModalOpen(true)} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <RegisterUser />
      </Modal>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;