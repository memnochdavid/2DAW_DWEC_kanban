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

        //nueva tarea
        const createRowElement = (rowText, rowIndex) => {
            const row = document.createElement("div");
            row.className = "table-row";
            row.innerText = rowText;

            row.addEventListener("dblclick", () => {
                let newRowText = prompt("Nuevo", rowText);
                if (newRowText !== null && newRowText.trim() !== "") {
                    col.rows[rowIndex] = newRowText;
                    localStorage.setItem('elements', JSON.stringify(appStatus.lsElements));
                    
                    row.innerText = newRowText;
                    rowText = newRowText;
                }
            });
            return row;
        };

        //carga las filas existentes
        if (col.rows && Array.isArray(col.rows)) {
            col.rows.forEach((rowText, rowIndex) => {
                const row = createRowElement(rowText, rowIndex);
                rowsContainer.appendChild(row);
            });
        }

        //sólo la primera columna tiene botón de añadir
        if(index === 0){
            const rowButtonContainer = document.createElement("div");
            rowButtonContainer.className = "table-row-button";

            const newRowBtn = document.createElement("button");
            newRowBtn.className = "btn btn-counter";
            newRowBtn.innerHTML = "+";


            newRowBtn.addEventListener("click", () => {
                //añade la nueva fila al modelo
                if (!col.rows) col.rows = [];
                const newRowText = "Nueva Tarea";
                col.rows.push(newRowText);
                
                localStorage.setItem('elements', JSON.stringify(appStatus.lsElements));

                //nueva fila
                const newRowIndex = col.rows.length - 1;
                const newRow = createRowElement(newRowText, newRowIndex);
                rowsContainer.appendChild(newRow);
            });

            rowButtonContainer.appendChild(newRowBtn);
            column.appendChild(rowButtonContainer);
        }

        container.appendChild(column);

    });
}
