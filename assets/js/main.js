//imports
import { includeHTML, renderBoard, appStatus } from './functions.js';



//lógica del menú de preferencias
const initMenuLogic = () => {
    const numInput = document.getElementById('num-columns');
    const btnInc = document.getElementById('btn-inc');
    const btnDec = document.getElementById('btn-dec');
    const container = document.getElementById('columns-container');
    const btnSave = document.getElementById('btn-save');
    const btnClear = document.getElementById('btn-clear');

    let currentColumns = [...appStatus.lsElements];

    numInput.value = currentColumns.length;

    //pinta los inputs indicados
    const renderInputs = () => {
        container.innerHTML = '';

        currentColumns.forEach((colName, index) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'column-input';
            input.placeholder = `Columna ${index + 1}`;
            input.value = colName;
            
            //actualiza el array
            input.addEventListener('input', (e) => {
                currentColumns[index] = e.target.value;
            });
            
            container.appendChild(input);
        });
    };

    //render inicial
    renderInputs();

    //más
    btnInc.addEventListener('click', () => {
        currentColumns.push(''); //nueva columna
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
        localStorage.setItem('elements', JSON.stringify(appStatus.lsElements));
        
        console.log('Guardado:', appStatus.lsElements);
        alert('Configuración guardada.');
        
        renderBoard();
    });

    //limpia
    btnClear.addEventListener('click', () => {
        currentColumns = [];
        numInput.value = 0;
        localStorage.clear();
        renderInputs();
    });
};


document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    let menuLoaded = false;

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
        }
    });
    
    document.addEventListener('click', (event) => {
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            event.target !== menuBtn) {
            closeMenu();
        }
    });
});
