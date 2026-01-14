export const appStatus = {
    //referencia a localStorage
    lsElements : (() => {
        const stored = localStorage.getItem('elements');
        let elements = stored ? JSON.parse(stored) : [];
        // Migration: Convert strings to objects if necessary
        if (Array.isArray(elements)) {
            elements = elements.map(el => {
                if (typeof el === 'string') {
                    return { title: el, rows: [] };
                }
                return el;
            });
        }
        return elements;
    })()
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

    appStatus.lsElements.forEach((col, index) => {
        const column = document.createElement("div");
        column.className = "table-column";
        column.innerHTML = '';


        //-----------------------
        const rowHeader = document.createElement("div");
        rowHeader.className = "table-row-header";

        const title = document.createElement("h3");
        title.innerHTML = `${col.title}`;
        rowHeader.appendChild(title);
        column.appendChild(rowHeader);
        //-----------------------

        //--------------------------
        const rowsContainer = document.createElement("div");
        rowsContainer.className = "table-row-container";
        column.appendChild(rowsContainer);

        //carga las filas
        if (col.rows && Array.isArray(col.rows)) {
            col.rows.forEach(rowText => {
                const row = document.createElement("div");
                row.className = "table-row";
                row.innerText = rowText;
                rowsContainer.appendChild(row);
            });
        }



        //sólo la primera columna
        if(index === 0){
            const rowButtonContainer = document.createElement("div");
            rowButtonContainer.className = "table-row-button";

            const newRowBtn = document.createElement("button");
            newRowBtn.className = "btn btn-counter";
            newRowBtn.innerHTML = "+";


            newRowBtn.addEventListener("click", () => {



                //añade la nueva fila
                if (!col.rows) col.rows = [];
                const newRowText = "Nueva Tarea";
                col.rows.push(newRowText);
                
                localStorage.setItem('elements', JSON.stringify(appStatus.lsElements));

                const newRow = document.createElement("div");
                newRow.className = "table-row";
                newRow.innerText = newRowText;
                rowsContainer.appendChild(newRow);
            });

            rowButtonContainer.appendChild(newRowBtn);

            column.appendChild(rowButtonContainer);
        }

        container.appendChild(column);

    });
}