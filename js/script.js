let developer = {
    name: 'Developers',
    id: 2,
    parent_id: 1,
  };
  let devLead = {
    name: 'Lead Developers',
    id: 1,
    parent_id: 0,
  };
  let devDeptHead = {
    name: 'Development Management',
    id: 0,
    parent_id: null,
  };
  
  let qaTester = {
    name: 'Testers',
    id: 5,
    parent_id: 4,
  };
  let qaLead = {
    name: 'Lead QA',
    id: 4,
    parent_id: 3,
  };
  let qaDeptHead = {
    name: 'Quality Assurance Management',
    id: 3,
    parent_id: null,
  };
    
  let companyStructure=[devDeptHead,devLead, developer, qaDeptHead, qaLead, qaTester];

  const employees = [
    {
        dept_unit_id: 0,
        id: 0,
        name: "YarikHead",
        tel: "123-123-3", 
        salary: 3000
    },
    {
        id: 1,
        name: "MashaLead",
        dept_unit_id: 1,
        tel: "123-123-3", 
        salary: 2000
    },
    {
        id: 2,
        name: "SashaLead",
        dept_unit_id: 1,
        tel: "123-123-3", 
        salary: 2200
    },
    {
        id: 3,
        name: "MirraDev",
        dept_unit_id: 2,
        tel: "123-123-3",
        salary: 1200
    },
    {
        id: 4,
        name: "IraDev",
        dept_unit_id: 2,
        tel: "123-123-3",
        salary: 1000
    },
    {
        id: 5,
        name: "DanikHead3",
        dept_unit_id: 3,
        tel: "123-123-33",
        salary: 3000
    },
    {
        id: 6,
        name: "KoliaLead",
        dept_unit_id: 4,
        tel: "123-123-3",
        salary: 2000
    },
    {
        id: 7,
        name: "OliaLead3",
        dept_unit_id: 4,
        tel: "123-123-3",
        salary: 2200
    },
    {
        id: 8,
        name: "SienaTest",
        dept_unit_id: 5,
        tel: "123-123-3",
        salary: 1000
    },
{
        id: 9,
        name: "LenaTest",
        dept_unit_id: 5,
        tel: "123-123-3",
        salary: 1200
    }
];

function getItemsTree (items) {
      for (let i = 0; i < items.length; i++) {
          const potentialParent = items[i];

          for (let j = 0; j < items.length; j++) {
              const potentialChild = items[j];

              if (potentialChild.parent_id === potentialParent.id) {
                  if (!potentialParent.children) {
                      potentialParent.children = [];
                  }

                  potentialParent.children.push(potentialChild);
              }
          }
      }

      return items.filter(i => !i.parent_id && i.parent_id !== 0);
}

let itemsTree = getItemsTree(companyStructure);

const treeElContainer = document.getElementById('tree-container');

buildDOMTree(itemsTree, treeElContainer);

function buildDOMTree(items, supportEl) {
    const ulEl = document.createElement('ul');

    ulEl.addEventListener('click', ev => {
        if (ev.target.nodeName === 'SPAN') {
            const deptId = +ev.target.getAttribute('data-dept-id');

            const filteredEmpl = employees.filter(empl => deptId === empl.dept_unit_id);

            buildTable(filteredEmpl);
        }

        if (ev.target.nodeName === 'I') {
            if (ev.target !== 'I') {
                ulEl.querySelectorAll('i').forEach(elem => elem.classList.remove('caret-down'));
            }
    
            let childrenContainer = ev.target.parentNode.querySelector('ul');
            if (!childrenContainer) return;

            childrenContainer.hidden = !childrenContainer.hidden;

            if (ev.target.nodeName === "I") {
                ev.target.classList.add('caret-down');
            }

            
        }
    });

    createHtmlTree(items, ulEl);

    supportEl.appendChild(ulEl);
}

function clearTable() {
    
    const tableEl = document.getElementsByTagName('table')[0];
    const tbodyEl = tableEl.getElementsByTagName('tbody')[0];

    if (!tbodyEl) {
        return;
    } 

    tableEl.removeChild(tbodyEl);
}

function buildTable(items) {
    clearTable();
    fillTable(items);
  
    function fillTable (items) {
        const tbodyEl = document.createElement('tbody');
        const keys = ['id', 'name', 'tel', 'salary'];

        items.forEach(item => {
            const trEl = document.createElement('tr');

            keys.forEach(key => {
                const tdEl = document.createElement('td');

                if (key === 'salary') {
                    tdEl.setAttribute('data-salary-empl-orig', item.salary);
                }

                tdEl.innerText = item[key];

                trEl.appendChild(tdEl);
            });

            tbodyEl.append(trEl);
        });

        const tableEl = document.getElementsByTagName('table')[0];
        tableEl.append(tbodyEl);
    }
}

function createHtmlTree(items, rootEl) {
    items.forEach(item => {
        const liEl = document.createElement('li');

        liEl.innerHTML = `<i class="fa fa-caret-right"></i><span data-dept-id="${item.id}">${item.name}</span>`;
        rootEl.appendChild(liEl);

        if (item.children) {
            const childrenUl = document.createElement('ul');
            liEl.appendChild(childrenUl);
            createHtmlTree(item.children, childrenUl);
        }
    });
}

document.getElementById('curr-sel').addEventListener('change', async (ev) => {
    const currId = ev.target.value;
    const currData = await fetchCurrencyById(currId);

    const tableSalaryItems = document.querySelectorAll('td[data-salary-empl-orig]');

    if (!tableSalaryItems) {
        return;
    }

    for (let i = 0; i < tableSalaryItems.length; i++) {
        const originalSalaryCount = +tableSalaryItems[i].getAttribute('data-salary-empl-orig');
        tableSalaryItems[i].innerText = (originalSalaryCount / currData.Cur_OfficialRate).toFixed(2);
    }
})

const currCache = {};

async function fetchCurrencyById(id) {
    if (!currCache[id]) {
        currCache[id] = fetch(`https://www.nbrb.by/api/exrates/rates/${id}`).then(data => data.json())
    }

    return currCache[id];
}

const btnEl = document.createElement('button');
btnEl.innerHTML = "Clear Table";
const clrBtn = document.getElementById('clr-btn');
clrBtn.appendChild(btnEl);

btnEl.addEventListener('click', ev => {
    clearTable();
})