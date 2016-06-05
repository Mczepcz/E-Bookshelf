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
              var newLi = $("<li>");
              var removeButton=$("<button class='delBtn'>Usuń</button>");
              var showButton=$("<button class='showBtn'>Więcej informacji</button>");
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
                var newDiv =$("<div><h1>"+book.title+"</h1><p>"+book.author_name +"</p><p>"+book.description+"</p></div");
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
    
    
    loadAllBooks();
    showHideBookInfo();
    addNewBook();
    
    
});
