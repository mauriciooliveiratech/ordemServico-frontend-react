import Header from "./Header";
import Sidebar from "./Sidebar";


export function Layout({children}: {children: React.ReactNode}) {
    return (
        <div style={{display: "flex", minHeight: "100vh"}}>
            <Sidebar onNovaOS={function (): void {
                throw new Error("Function not implemented.");
            } } onAbrirMarca={function (): void {
                throw new Error("Function not implemented.");
            } } onAbrirModelo={function (): void {
                throw new Error("Function not implemented.");
            } } onAbrirServico={function (): void {
                throw new Error("Function not implemented.");
            } } />
            <div style={{flex: 1, }}>
                <Header />
                <main style={{padding: "20px"}}>{children}</main>
            </div>
        </div>
    );
}