$(function(){
    var loadAllBooks = function(){
      var bookList = $("#listWithBooks");
      $.ajax({
          url:"http://192.168.33.22/bookshelf/E-Bookshelf/API/books.php",
          method:"GET",
          dataType: "json"
      }).done(function(bookNamesArray){
          bookList.empty();
          for(var i = 0; i < bookNamesArray.length; i++){
              var newLi = $("<li class='list-group-item lead'>");
              var removeButton=$("<button class='delBtn btn btn-danger btn-sm pull-right'>Usuń</button>");
              var showButton=$("<button class='showBtn btn btn-success btn-sm pull-right'>Więcej informacji</button>");
              newLi.attr("data-id", bookNamesArray[i].id);
              newLi.text(bookNamesArray[i].name);
              newLi.append(showButton);
              newLi.append(removeButton);
              
              bookList.append(newLi);
          }
      }).fail(function(xhr, status, error){
          console.log("Load all books ajax failed");
      });
    };
    var showHideBookInfo = function(){
        var bookList = $("#listWithBooks");
        bookList.on("click", ".showBtn", function(event){
            var bookId=$(this).parent().data("id");
            var showButton = $(this);
            $.ajax({
                url: "http://192.168.33.22/bookshelf/E-Bookshelf/API/books.php",
                method: "GET",
                data: {id : bookId},
                dataType: "json"
            }).done(function(book){
                var newDiv =$("<div><h3>"+book.title+"</h3><button class='editBtn btn btn-success btn-sm '>Włącz edycje</button><p class='authorName'><small>Author: </small><br/>"+book.author_name +"</p><p><small>Description: </small><br/>"+book.description+"</p></div");
                showButton.parent().append(newDiv);
                showButton.removeClass("showBtn");
                showButton.text("Zwiń informacje");
                showButton.addClass("hideBtn");
            }).fail(function(xhr,status,error){
                console.log("AJAX failed when reading book with id");
            });
        });
        bookList.on("click",".hideBtn",function(event){
            var hideButton = $(this);
            hideButton.parent().find("div").remove();
            hideButton.text("Więcej informacji");
            hideButton.removeClass("hideBtn");
            hideButton.addClass("showBtn");
        });
    };
    var addNewBook = function(){
        var addBookForm = $("#addBook");
       
        addBookForm.on("submit",function(event){
            event.preventDefault();
            var title = $(this).find("input[name=title]").prop('value');
            var authorName = $(this).find("input[name=authorName]").prop('value');
            var desc = $(this).find("textarea[name=desc]").prop('value');
            $.ajax({
                url: "http://192.168.33.22/bookshelf/E-Bookshelf/API/books.php",
                method: "POST",
                data: { title : title, authorName : authorName, desc : desc},
                dataType: "text"
            }).done(function(message){
                $(this).find("input[name=title]").prop('value',"");
                $(this).find("input[name=authorName]").prop('value',"");
                $(this).find("textarea[name=desc]").prop('value',"");
                loadAllBooks();
                console.log(message);
            }).fail(function(xhr,status,error){
                console.log("AJAX failed when adding new book");
            });
            $(this).find("input[name=title]").prop('value',"");
            $(this).find("input[name=authorName]").prop('value',"");
            $(this).find("textarea[name=desc]").prop('value',"");
            loadAllBooks();
        });
    };
    var deleteBook = function(){
        var bookList = $("#listWithBooks");
        bookList.on("click",".delBtn",function(event){
            var bookId=$(this).parent().data("id");
            $.ajax({
                url: "http://192.168.33.22/bookshelf/E-Bookshelf/API/books.php",
                method: "DELETE",
                data: {id : bookId},
                dataType: "text"   
            }).done(function(message){
                console.log(message);
                loadAllBooks();
            }).fail(function(xhr,status,error){
                console.log("AJAX falied when deleting new book");
            });

        });       
    };
    var editBook = function(){
        var bookList = $("#listWithBooks");
        bookList.on("click",".editBtn",function(event){
            var editBtn=$(this);
            editBtn.text("Wyłącz edycję");
            editBtn.removeClass("editBtn");
            editBtn.addClass("editOffBtn");
            var bookId=$(this).parent().parent().data("id"); 
            var editBookForm = $(this).parent().parent().parent().siblings("form");
            editBookForm.children().children("#submitBtn").attr("value", "Zapisz zmiany");
            editBookForm.off("submit");
            saveEditedBook(bookId);
            
        });
        bookList.on("click",".editOffBtn",function(event){
            var editOffBtn=$(this);
            editOffBtn.text("Włącz edycję");
            editOffBtn.removeClass("editOffBtn");
            editOffBtn.addClass("editBtn");
            var editBookForm = $(this).parent().parent().parent().siblings("form");
            editBookForm.children().children("#submitBtn").attr("value", "Dodaj książkę");
            editBookForm.children().children("#submitBtn").removeClass("btn-success");
            editBookForm.children().children("#submitBtn").addClass("btn-primary");
            editBookForm.off("submit");
            addNewBook();  
        });  
    };
    var saveEditedBook = function(id){
        var bookId = id;
        var editBookForm = $("#addBook");
        editBookForm.children().children("#submitBtn").attr("value", "Zapisz zmiany");
        editBookForm.children().children("#submitBtn").removeClass("btn-primary");
        editBookForm.children().children("#submitBtn").addClass("btn-success");
        editBookForm.one("submit","",bookId,function(event){
            event.preventDefault();
            var title = $(this).find("input[name=title]").prop('value');
            var authorName = $(this).find("input[name=authorName]").prop('value');
            var desc = $(this).find("textarea[name=desc]").prop('value');
            $.ajax({
                url: "http://192.168.33.22/bookshelf/E-Bookshelf/API/books.php",
                method: "PUT",
                data: { id : bookId, title : title, authorName : authorName, desc : desc},
                dataType: "text"
            }).done(function(message){
                console.log(message);
                $(this).find("input[name=title]").prop('value',"");
                $(this).find("input[name=authorName]").prop('value',"");
                $(this).find("textarea[name=desc]").prop('value',"");
            loadAllBooks();
            }).fail(function(xhr,status,error){
                console.log("AJAX failed when updating new book");
            });

            editBookForm.off("submit");
            editBookForm.children().children("#submitBtn").attr("value", "Dodaj książkę");
            editBookForm.children().children("#submitBtn").removeClass("btn-success");
            editBookForm.children().children("#submitBtn").addClass("btn-primary");
            addNewBook();        
        });
        
    };
        
    
    
    loadAllBooks();
    showHideBookInfo();
    addNewBook();
    deleteBook();
    editBook();
    
    
});
