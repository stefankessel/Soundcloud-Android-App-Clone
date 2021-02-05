class ViewController{
    constructor(root){
        this.root = root;
        
    }
    initialize(){
        this.mainElement = this.root.getElementsByTagName('main')[0];
        this.toggleView();
        // this.prepareFading();
        this.prepareListInteraction();
        this.prepareAddingElement();
        this.getDataFromServer();
        this.refreshToogle()
    }
    toggleView(){
        this.toggleBtn
         = this.root.querySelector(".toggle-icon");
        this.toggleBtn.addEventListener("click", () => {
            this.mainElement.classList.toggle("myapp-faded");
            this.mainElement.ontransitionend = this.tansitionHandler
        })
    }
    // prepareFading(){
    //     this.mainElement.classList.toggle("myapp-faded");
    //     this.mainElement.ontransitionend = this.tansitionHandler
    // }
    tansitionHandler = () => {
        this.mainElement.classList.toggle("myapp-faded");
        this.root.classList.toggle('myapp-tiles');
        this.mainElement.ontransitionend = null;
    }
    prepareListInteraction(){
        const ulElement = this.mainElement.querySelector('ul');
        ulElement.onclick = (e) => {
            const liElement = this.getEl(e.target);
            const title = this.getListTitle(liElement);
            if(e.target.classList.contains('list-data-menu')){
                const url = this.getListImage(liElement);
                const flag = confirm(`Wollen Sie diesen Eintrag wirklich löschen? \nTitle: ${title} \nimgURL: ${url}`)
                if(flag){
                    this.removeListItem(liElement)
                }
                return;
            }
            alert('title: ' + title)
        }
    }
    getEl(el){
        if(el instanceof HTMLLIElement){
            return el;
        }
        else if(el === document.body){
            return null;
        }
        else if(el.parentElement){
            return this.getEl(el.parentElement)
        }
    }
    getListTitle(liElement){
        return liElement.querySelector('h5').textContent;
    }
    getListImage(liElement){
        return liElement.querySelector('img').src;
    }

    prepareAddingElement(){
        this.dolly = this.root.querySelector('template');
        // this.dolly.parentNode.removeChild(this.dolly);
        // this.dolly.classList.remove('myapp-template');

        const addElementBtn = this.root.querySelector('.new-item');
        addElementBtn.onclick = () => {
            const imgurl = "./data/img/" + (((Date.now() % 3) + 1) * 100) + "_100.jpeg";
            const newObj = {src: imgurl};
            this.addElementToList(newObj);
        }
    }

    addElementToList(obj){
        const ulElement = this.mainElement.getElementsByTagName('ul')[0];

        // const newLi = this.dolly.cloneNode(true);
        const newLi = document.importNode(this.dolly.content, true).querySelector('li');
        newLi.querySelector('.list-image').src = obj.src;
        newLi.querySelector('.list-data-owner').innerHTML = obj.owner || 'owner';
        newLi.querySelector('.list-data-title').innerHTML = obj.title || 'title';
        newLi.querySelector('.list-data-added').innerHTML = obj.added || new Date().toLocaleDateString();
        newLi.querySelector('.list-data-numOfTags').innerHTML = obj.numOfTags || 0;


        ulElement.appendChild(newLi);
        newLi.scrollIntoView({behavior: "smooth"});
    }

    getDataFromServer(){
        fetch('./data/listitems.json').then(res => res.json()).then( res =>{
            res.forEach( obj => {
                this.addElementToList(obj)
            })
        })
    }
    refreshToogle(){
        const refreshBtn = this.root.querySelector('.refresh-toogle');

        refreshBtn.onclick = () => {
            this.root.querySelectorAll('main ul li')
            .forEach( (el) => el.parentNode.removeChild(el));
            this.getDataFromServer()
        }
    }
    removeListItem(liElement){
        liElement.parentNode.removeChild(liElement)
    }
}

window.onload = () => {
    const instance = new ViewController(document.body);
    instance.initialize();
}