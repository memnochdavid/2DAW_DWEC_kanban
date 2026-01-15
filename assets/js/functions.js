let currentEdit = { colIndex: null, rowIndex: null };

export const loadData = () => {
    const stored = localStorage.getItem('elements');
    let elements = stored ? JSON.parse(stored) : [];
    //convierte strings a objetos si es necesario
    if (Array.isArray(elements)) {
        elements = elements.map(el => {
            if (typeof el === 'string') {
                return { title: el, rows: [] };
            }
            return el;
        });
    }
    return elements;
};

export const appStatus = {
    //referencia a localStorage
    lsElements : loadData()
}

export const saveData = () => {
    localStorage.setItem('elements', JSON.stringify(appStatus.lsElements));
};

export const clearData = () => {
    localStorage.clear();
};

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

    if(appStatus.lsElements.length === 0){
        includeHTML("#container-main", "./includes/emptyBody.html").then(r => {});
    }
    else{
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

            rowsContainer.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            //guarda en la nueva columna
            rowsContainer.addEventListener("drop", (e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData("text/plain");
                if (!data) return;

                const parsedData = JSON.parse(data);
                const originColIndex = parsedData.originColIndex;
                const originRowIndex = parsedData.originRowIndex;

                if (originColIndex === undefined || originRowIndex === undefined) return;

                const targetColIndex = index;

                //sueltas en la misma
                if (originColIndex === targetColIndex) return;

                //mueve la tarea
                const taskToMove = appStatus.lsElements[originColIndex].rows[originRowIndex];

                //borra de la original
                appStatus.lsElements[originColIndex].rows.splice(originRowIndex, 1);

                //añade al destino
                if (!appStatus.lsElements[targetColIndex].rows) {
                    appStatus.lsElements[targetColIndex].rows = [];
                }
                appStatus.lsElements[targetColIndex].rows.push(taskToMove);

                //guarda y muestra
                saveData();
                renderBoard();
            });

            //nueva tarea
            const createRowElement = (rowText, rowIndex) => {
                const row = document.createElement("div");
                row.className = "table-row";

                //texto
                const textSpan = document.createElement("span");
                textSpan.innerText = rowText;
                textSpan.style.flexGrow = "1"; //para que ocupe el espacio disponible
                row.appendChild(textSpan);

                //borrar
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "btn btn-red btn-close-small";
                deleteBtn.innerHTML = "x";

                deleteBtn.addEventListener("click", (e) => {
                    e.stopPropagation(); //evita que se dispare el dblclick del row
                    
                    row.classList.add("deleting");

                    //delay para que de tiempo a aplicar la clase que le cambia el color
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    delay(200).then(() => {
                        if(confirm("¿Borrar esta tarea?")) {
                            row.classList.remove("deleting");
                            row.classList.add("deleted");
                            
                            delay(200).then(() => {
                                col.rows.splice(rowIndex, 1);
                                saveData();
                                renderBoard();
                            });
                        } else {
                            row.classList.remove("deleting");
                        }
                    });
                });

                row.appendChild(deleteBtn);

                row.draggable = true;

                row.addEventListener("dblclick", () => {
                    //referencia de lo que se está editando
                    currentEdit = { colIndex: index, rowIndex: rowIndex };

                    //muestra diálogo
                    const dialog = document.getElementById("rename-dialog");
                    const input = dialog.querySelector(".window-input");

                    if (dialog && input) {
                        input.value = rowText;
                        dialog.style.display = "flex";
                    }
                });

                row.addEventListener("dragstart", (e) => {
                    const dragData = {
                        originRowIndex: rowIndex,
                        originColIndex: index
                    };
                    e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
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

                    saveData();

                    //nueva fila
                    renderBoard(); //re-renderiza

                    //busca la última fila añadida en la primera columna y añadirle la clase creating
                    const firstColumnRows = document.querySelectorAll('.table-column:first-child .table-row');
                    if (firstColumnRows.length > 0) {
                        const lastRow = firstColumnRows[firstColumnRows.length - 1];
                        lastRow.classList.add('creating');

                        //quita la clase
                        setTimeout(() => {
                            lastRow.classList.remove('creating');
                        }, 300);
                    }
                });

                rowButtonContainer.appendChild(newRowBtn);
                column.appendChild(rowButtonContainer);
            }

            container.appendChild(column);

        });
    }
}

export const setupDialogListeners = () => {
    const dialog = document.getElementById("rename-dialog");
    const btnRename = document.getElementById("input-rename");
    const btnCancel = document.getElementById("input-cancel");
    const btnClose = document.getElementById("btn-close");
    const input = dialog ? dialog.querySelector(".window-input") : null;

    const closeDialog = () => {
        if (dialog) dialog.style.display = "none";
        currentEdit = { colIndex: null, rowIndex: null };
    };

    if (btnRename) {
        btnRename.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentEdit.colIndex !== null && currentEdit.rowIndex !== null && input) {
                const newText = input.value.trim();
                if (newText) {
                    appStatus.lsElements[currentEdit.colIndex].rows[currentEdit.rowIndex] = newText;
                    saveData();
                    renderBoard();
                }
            }
            closeDialog();
        });
    }

    if (btnCancel) {
        btnCancel.addEventListener("click", (e) => {
            e.preventDefault();
            closeDialog();
        });
    }
    
    if (btnClose) {
        btnClose.addEventListener("click", (e) => {
            e.preventDefault();
            closeDialog();
        });
    }
}
