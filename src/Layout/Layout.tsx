import Sidebar from "./Sidebar";
import Header from "./Header";

export function Layout({children}: {children: React.ReactNode}) {
    return (
        <div style={{display: "flex", minHeight: "100vh"}}>
            <Sidebar onNovaOS={function (): void {
                throw new Error("Function not implemented.");
            } } />
            <div style={{flex: 1, }}>
                <Header />
                <main style={{padding: "20px"}}>{children}</main>
            </div>
        </div>
    );
}