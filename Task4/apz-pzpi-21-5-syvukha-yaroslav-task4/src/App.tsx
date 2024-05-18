import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, Bounce, toast } from 'react-toastify';

import { Button, StateSuspense, Title } from './components';
import { FullPageLoader } from './components';
import { ROUTE } from './constants';
import GlobalStyles from './globals';
import MainAdminContainer from './modules/admin/containers/MainAdminContainer';
import AdminOrganizationContainer from './modules/admin/containers/OrganizationContainer';
import AdminAddOrganization from './modules/admin/containers/OrganizationContainer/add';
import AdminEditOrganization from './modules/admin/containers/OrganizationContainer/edit';
import UserContainer from './modules/admin/containers/UserContainer';
import AdminEditUser from './modules/admin/containers/UserContainer/edit';
import { useAuth } from './modules/auth';
import { DocumentContainer } from './modules/document';
import EditDocumentContainer from './modules/document/containers/EditContainer';
import UploadDocumentContainer from './modules/document/containers/UploadDocumentContainer';
import { LayoutContainer } from './modules/layout';
import {
  AddContainer,
  EditContainer,
  MainContainer,
} from './modules/organization';
import { ProfileContainer, StatisticsContainer } from './modules/user';
import { HomePage, NotFoundPage, UserPage } from './pages';
import { axios } from './utils';

const App = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { authorized, isReady } = useAuth();
  const { t } = useTranslation();

  // This must work only once
  useEffect(() => {
    if (pathname === '/') {
      navigate(ROUTE.HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    toast.promise(axios.get('/app/test'), {
      error: 'Server is not available',
    });
  }, []);

  return (
    <>
      <GlobalStyles />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Bounce}
      />
      <StateSuspense show={isReady} fallback={<FullPageLoader />}>
        <Routes>
          <Route path={ROUTE.HOME} element={<LayoutContainer />}>
            <Route index element={<HomePage />} />
            {/* REDIRECT */}
            {authorized() ? (
              <>
                {/* User */}
                <Route path={ROUTE.USER} element={<UserPage />}>
                  <Route index element={<ProfileContainer />} />
                  <Route
                    path={ROUTE.USER_PROFILE}
                    element={<ProfileContainer />}
                  />
                  <Route
                    path={ROUTE.USER_STATISTICS}
                    element={<StatisticsContainer />}
                  />
                </Route>

                {/*Organization*/}
                <>
                  <Route
                    path={ROUTE.ORGANIZATION}
                    element={<MainContainer />}
                  />
                  <Route
                    path={ROUTE.ADD_ORGANIZATION}
                    element={<AddContainer />}
                  />
                  <Route
                    path={ROUTE.EDIT_ORGANIZATION}
                    element={<EditContainer />}
                  />
                </>

                {/* Document */}
                <>
                  <Route
                    path={ROUTE.DOCUMENT}
                    element={<DocumentContainer />}
                  />
                  <Route
                    path={ROUTE.ADD_DOCUMENT}
                    element={<UploadDocumentContainer />}
                  />
                  <Route
                    path={`${ROUTE.EDIT_DOCUMENT}/:id`}
                    element={<EditDocumentContainer />}
                  />
                </>

                {/* Admin */}
                <Route path={ROUTE.ADMIN} element={<MainAdminContainer />}>
                  <Route path={ROUTE.ADMIN_USERS} element={<UserContainer />} />
                  <Route
                    path={`${ROUTE.ADMIN_USERS_EDIT}/:id`}
                    element={<AdminEditUser />}
                  />
                  <Route
                    path={ROUTE.ADMIN_ORGANIZATIONS}
                    element={<AdminOrganizationContainer />}
                  />
                  <Route
                    path={ROUTE.ADMIN_ORGANIZATIONS_ADD}
                    element={<AdminAddOrganization />}
                  />
                  <Route
                    path={`${ROUTE.ADMIN_ORGANIZATIONS_EDIT}/:id`}
                    element={<AdminEditOrganization />}
                  />
                  <Route
                    path={ROUTE.ADMIN_DOCUMENTS}
                    element={<DocumentContainer />}
                  />
                </Route>
              </>
            ) : null}

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </StateSuspense>
    </>
  );
};

export default App;
