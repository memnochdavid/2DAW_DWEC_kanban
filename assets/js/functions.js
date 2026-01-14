export const appStatus = {
    //referencia a localStorage
    lsElements : JSON.parse(localStorage.getItem('elements')) || []
}
export const includeHTML = (selector, url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar el HTML.");
            }
            return response.text();
        })
        .then(data => {
            document.querySelector(selector).innerHTML = data;
        })
        .catch(error => {
            console.error('Error al cargar el HTML:', error);
            document.querySelector(selector).innerHTML = "<p>Error al cargar el contenido.</p>";
        });
};


export const renderBoard = () => {

    const container = document.getElementById("container-main");
    container.innerHTML = "";

    appStatus.lsElements.forEach((colName, index) => {
        const column = document.createElement("div");
        column.className = "table-column";
        // column.id = `${colName}`;
        column.innerHTML = '';

        const row = document.createElement("div");
        row.className = "table-row-header";

        const title = document.createElement("h3");
        title.innerHTML = `${colName}`;
        row.appendChild(title);
        column.appendChild(row);

        //sólo la primera columna
        if(index === 0){
            const newRowBtn = document.createElement("button");
            newRowBtn.className = "btn btn-counter";
            newRowBtn.innerHTML = "+";


            newRowBtn.addEventListener("click", () => {
                const newRow = document.createElement("div");
                newRow.className = "table-row";
                column.appendChild(newRow);
            });
            column.appendChild(newRowBtn);
        }

        container.appendChild(column);

    });





}