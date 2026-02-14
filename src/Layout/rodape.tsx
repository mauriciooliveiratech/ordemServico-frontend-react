export default function Rodape() {
  return (
    <footer
      style={{
        padding: 10,
        textAlign: "center",
        background: "#2e7d32",
        color: "#fff",
        fontSize: 14,
        height: 10,
        width: "97%",
        alignContent: "center",
        borderRadius: 6,
        margin: "0px auto",
      }}
    >
      © Mauricio Oliveira (DevTech {new Date().getFullYear()}) - Sistema de Ordens de Serviço
    </footer>
  );
}
