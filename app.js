
new Vue({
  el: '.app',
  data: {
    userName: 'Петя',
    listsArray: [],
    setListName: '',
    setCardName: '',
    activeListIndex: 0,
    activeCardIndex: 0,
    priority: false,
    completeCard: false,
    alertContent: '',
    showAlert: false,
    crossNumber: 1,
    headerModal: '',
    textModal: '',
    btnModalFunction: '',
    renderModalContent: true,
    editIconNumber: 1,
    editList: true,
    changedText: '',
    deletedElName: '',
    showFormRegistration: true
  },
  methods: {
    createList: function() {
      let list = new Vue({
        data: {
          nameList: this.setListName,
          cardsOfList: [],
          completed: false,
          empty: true,
          mustDo: false,
          showList: true
        }
      })
      this.listsArray.push(list);
      this.activeListIndex = this.listsArray.length - 1
      this.listsArray.sort(this.alphabetSort)
      this.setListName = ''
    },
    createCard: function() {
      let card = new Vue({
        data: {
          content: this.setCardName,
          done: false,
          priority: this.priority,
          time: this.getTime()
        }
      })
      this.listsArray[this.activeListIndex].cardsOfList.push(card)
      this.setCardName = ''
    },
    alphabetSort: function(a,b) {
      if ( a.nameList < b.nameList ){
        return -1;
      }
      if ( a.nameList > b.nameList ){
        return 1;
      }
      return 0;
    },
    needSort: function(e) {
        this.setStatusList()
        if(e.target.value == 1) {
          for(let i = 0; i < this.listsArray.length; i++) {
            this.listsArray[i].showList = true
          }
        }
        if(e.target.value == 2) {
          for(let i = 0; i < this.listsArray.length; i++) {
            if(this.listsArray[i].mustDo == true) {
              this.listsArray[i].showList = true
            } else {
              this.listsArray[i].showList = false
            }
          }
        }
        if(e.target.value == 3) {
          for(let i = 0; i < this.listsArray.length; i++) {
            if(this.listsArray[i].completed == true) {
              this.listsArray[i].showList = true
            } else {
              this.listsArray[i].showList = false
            }
          }
        }
    },
    listStyle: function(index) {
        let completeCardQuantity = 0;
        for(let i = 0; i < this.listsArray[index].cardsOfList.length; i++) {
          if(this.listsArray[index].cardsOfList[i].done) {
            completeCardQuantity++
          }
        }
        if (this.listsArray[index].cardsOfList.length == 0) {
          return {
            emptyList: true
          }
        } else if(completeCardQuantity == this.listsArray[index].cardsOfList.length){
          return {
            doneList: true
          }
        } else {
          return {
            unfinishedList: true
          }
        }
    },
    setStatusCard: function(e, index) {
      this.listsArray[this.activeListIndex].cardsOfList[index].done = e.target.checked;
    },
    setStatusList: function() {
      let readyCards = 0
      for(let i = 0; i < this.listsArray.length; i++) {
          if(this.listsArray[i].cardsOfList.length > 0) {
            this.listsArray[i].empty = false
          }
            for(let j = 0; j < this.listsArray[i].cardsOfList.length; j++) {
              if(this.listsArray[i].cardsOfList[j].done == true) {
                readyCards++
              }
            }
          if ((readyCards ==  this.listsArray[i].cardsOfList.length) &&
               (readyCards != 0)) {
            this.listsArray[i].completed = true;
            this.listsArray[i].mustDo = false
          } else {
            this.listsArray[i].completed = false;
          }
          if ((this.listsArray[i].empty == false) && (this.listsArray[i].completed == false)) {
              this.listsArray[i].mustDo = true
          }
          readyCards = 0
      }
    },
    setAlertContent: function(bValue) {
      this.showAlert = true
      let buttonValue = bValue
      if(buttonValue == 'listButton') {
        this.alertContent = 'Добавлен новый список: ' +  this.listsArray[this.activeListIndex].nameList
      }
      if(buttonValue == 'cardButton') {
        this.alertContent = 'Подзадача ' + this.listsArray[this.activeListIndex].cardsOfList[this.listsArray[this.activeListIndex].cardsOfList.length - 1].content + " добавлена в список " + this.listsArray[this.activeListIndex].nameList
      }
      if((buttonValue == 'saveEditionButton') && (this.editIconNumber == 1)) {
        this.alertContent = 'Название списка успешно изменено на ' + `"${this.listsArray[this.activeListIndex].nameList}"`
      }
      if((buttonValue == 'saveEditionButton') && (this.editIconNumber == 2)) {
        this.alertContent = 'Название подзадачи успешно изменено на ' + `"${this.listsArray[this.activeListIndex].cardsOfList[this.activeCardIndex].content}"`
      }
      if((buttonValue == 'deleteElement') && (this.crossNumber == 1)) {
        this.alertContent = 'Список ' + this.deletedElName + ' успешно удалён'
      }
      if((buttonValue == 'deleteElement') && (this.crossNumber == 2)) {
        this.alertContent = 'Подзадача ' + this.deletedElName + ' успешно удалёна'
      }
      this.getAlert()
    },
    getAlert: function() {
        let vm = this
        setTimeout(() => vm.showAlert = false, 2000);
    },
    deleteList: function(){
      this.deletedElName =  `${this.listsArray[this.activeListIndex].nameList}`
      this.listsArray.splice(this.activeListIndex, 1)
    },
    deleteCard: function(){
        this.deletedElName = this.listsArray[this.activeListIndex].cardsOfList[this.activeCardIndex].content
        this.listsArray[this.activeListIndex].cardsOfList.splice(this.activeCardIndex, 1)
    },
    modalContent: function(index) {
      if(this.crossNumber == 1) {
        this.headerModal = 'Удалить список'
        this.textModal = 'Вы действительно хотите удалить список ' + `"${this.listsArray[index].nameList}"`
        this.btnModalFunction = this.deleteList
      }
      if(this.crossNumber == 2) {
        this.headerModal = 'Удалить подзадачу'
        this.textModal = 'Вы действительно хотите удалить подзадачу ' + `"${this.listsArray[this.activeListIndex].cardsOfList[index].content}"` + ' из списка ' + `"${this.listsArray[this.activeListIndex].nameList}"`
        this.btnModalFunction = this.deleteCard
      }
      this.renderModalContent = true
    },
    editModalContent: function() {
      this.editIconNumber == 1 ? this.headerModal = 'Редактировать список' : this.headerModal = 'Редактировать дело'
      this.renderModalContent = false
    },
    saveEdition: function() {
      if(this.editList) {
        this.listsArray[this.activeListIndex].nameList = this.changedText
      } else {
        this.listsArray[this.activeListIndex].cardsOfList[this.activeCardIndex].content = this.changedText
      }
      this.listsArray.sort(this.alphabetSort)
      this.changedText = ''
    },
    getTime: function() {
      let time = new Date()
      return time.getDay() + '.' + time.getMonth() + '.' + time.getFullYear() + ' ' + time.getHours() + ':' + time.getMinutes()
    }
  }
})
