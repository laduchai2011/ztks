import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signin from '@src/screen/Signin';
import Home from '@src/screen/Home';
import Voucher from '@src/screen/Voucher';
import NotFoundPage from '@src/screen/NotFoundPage';
import { route_enum } from './type';

const router = createBrowserRouter(
    [
        { path: route_enum.SIGNIN, element: <Signin /> },
        { path: route_enum.HOME, element: <Home /> },
        { path: route_enum.VOUCHER, element: <Voucher /> },
        { path: '*', element: <NotFoundPage /> }, // Trang 404
    ],
    {
        future: { v7_startTransition: true } as any,
    }
);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
