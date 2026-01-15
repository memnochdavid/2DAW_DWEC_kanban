//imports
import {includeHTML, renderBoard, appStatus, setupDialogListeners, saveData, clearData} from './functions.js';


let refreshMenuData = () => {};

//lógica del menú de preferencias
const initMenuLogic = () => {
    const numInput = document.getElementById('num-columns');
    const btnInc = document.getElementById('btn-inc');
    const btnDec = document.getElementById('btn-dec');
    const container = document.getElementById('columns-container');
    const btnSave = document.getElementById('btn-save');
    const btnClear = document.getElementById('btn-clear');

    let currentColumns = [];

    //pinta los inputs indicados
    const renderInputs = () => {
        container.innerHTML = '';

        currentColumns.forEach((col, index) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'column-input';
            input.placeholder = `Columna ${index + 1}`;
            input.value = col.title;


            //actualiza el array
            input.addEventListener('input', (e) => {
                currentColumns[index].title = e.target.value;
            });
            
            container.appendChild(input);
        });
    };

    //refrescar los datos del menú desde el estado global
    refreshMenuData = () => {
        currentColumns = JSON.parse(JSON.stringify(appStatus.lsElements));
        numInput.value = currentColumns.length;
        renderInputs();
    };

    //render inicial
    refreshMenuData();

    //más
    btnInc.addEventListener('click', () => {
        currentColumns.push({ title: '', rows: [] }); //nueva columna
        numInput.value = currentColumns.length;
        renderInputs();
    });

    //menos
    btnDec.addEventListener('click', () => {
        if (currentColumns.length > 0) {
            currentColumns.pop(); //borra
            numInput.value = currentColumns.length;
            renderInputs();
        }
    });

    //guardar
    btnSave.addEventListener('click', () => {

        appStatus.lsElements = currentColumns;
        saveData();
        
        alert('Configuración guardada.');
        
        renderBoard();
    });

    //limpia
    btnClear.addEventListener('click', () => {
        currentColumns = [];
        numInput.value = 0;
        clearData();
        renderInputs();
    });
};


document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    let menuLoaded = false;

    renderBoard();

    //cerrar menú
    const closeMenu = () => {
        sidebar.classList.remove('active');
        menuBtn.classList.remove('rotate');
    };

    menuBtn.addEventListener('click', () => {
        //si el menú está abierto, lo cierra
        if (sidebar.classList.contains('active')) {
            closeMenu();
            return;
        }

        //clase para rotación
        menuBtn.classList.add('rotate');

        if (!menuLoaded) {
            includeHTML('#sidebar', './includes/menu.html').then(() => {
                menuLoaded = true;
                sidebar.classList.add('active'); 

                //lógica de cerrar
                const closeBtn = document.getElementById('btn-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', closeMenu);
                }

                initMenuLogic();
            });
        } else {
            sidebar.classList.add('active'); 
            refreshMenuData(); //actualiza los datos al reabrir el menú
        }
    });

    //renombrar
    includeHTML("#dialog-container", "./includes/renameDialog.html")
        .then(() =>{
            setupDialogListeners();
        });

    document.addEventListener('click', (event) => {
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            event.target !== menuBtn) {
            closeMenu();
        }
    });
});
