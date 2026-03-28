import { FC } from "react";

import AdminNavbar from "../layout/AdminNavbar";
import DummyTemplate from "../mock/DummyTemplate";

const UnAuthTemplate: FC = () => {
    return (
        <>
            <AdminNavbar />
            <DummyTemplate />
        </>
    );
};

export default UnAuthTemplate;
