const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const bookinstance = require("../models/bookinstance");

exports.bookinstance_list = asyncHandler(async(req, res, next)=>{
    const allBookInstances = await BookInstance.find().populate("book").exec();
    res.render("bookinstance_list", {
        title: "book Instance List",
        bookinstance_list: allBookInstances
    });
});

exports.bookinstance_detail = asyncHandler(async(req, res, next)=>{
    const bookinstance = await BookInstance.findById(req.params.id).populate("book").exec();
    if (bookinstance === null){
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
    }
    res.render("bookinstance_detail", {
        title: "book",
        bookinstance: bookinstance
    });
});

exports.bookinstance_create_get = asyncHandler(async(req, res, next)=>{
    const allBooks = await Book.find({}, "title").sort({title:1}).exec();
    res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks
    });
});

exports.bookinstance_create_post = [
    body("book", "Book must be specified")
        .trim()
        .isLength({min:1})
        .escape(),
    body("imprint", "Imprint must be specified")
        .trim()
        .isLength({min:1})
        .escape(),
    body("status")
        .escape(),
    body("due_back", "Invalid date")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),
    asyncHandler(async(req, res, next)=>{
        const errors = validationResult(req);
        const bookInstance = new BookInstance({
            book:req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        });
        if (!errors.isEmpty()){
            const allBooks = await Book.find({}, "title").sort({title:1}).exec();
            res.render("bookinstance_form", {
                title: "Create BookInstance",
                book_list: allBooks,
                selected_book: bookinstance.book._id,
                errors:errors.array(),
                bookinstance: bookInstance
            });
            return;
        } else {
            await bookInstance.save();
            res.redirect(bookInstance.url);
        }
    })
];

exports.bookinstance_delete_get = asyncHandler(async(req, res, next)=>{
    const bookInstance = await BookInstance.findById(req.params.id).populate("book").exec();
    if (bookInstance === null){
        res.redirect("/catalog/bookinstances");
    }
    res.render("bookinstance_delete", {
        title: "Delete Bookinstance",
        bookInstance: bookInstance
    });
});

exports.bookinstance_delete_post = asyncHandler(async(req,res, next)=>{
    //Going to assume I dont need to check that this bookinstance exists before deleting it
    await BookInstance.findByIdAndDelete(req.body.id);
    res.redirect("/catalog/bookinstances");
    
});

exports.bookinstance_update_get = asyncHandler(async(req, res, next)=>{
    const [bookinstance, allBooks] = await Promise.all([
        BookInstance.findById(req.params.id).populate("book").exec(),
        Book.find().exec()
    ]);
    if (bookinstance===null){
        const err = new Error("Bookinstance not found");
        err.status = 404;
        return next(err);
    }
    res.render("bookinstance_form", {
        title: "Update Bookinstance",
        bookinstance: bookinstance,
        selected_book: bookinstance.book.id,
        book_list: allBooks
    });
});

exports.bookinstance_update_post = [
    body("book", "Book must be specified.")
        .trim()
        .isLength({min:1})
        .escape(),
    body("imprint", "Imprint must be specified.")
        .trim()
        .isLength({min:1})
        .escape(),
    body("status")
        .escape(),
    body("due_back", "Invalid date.")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),
    asyncHandler(async(req, res, next)=>{
        const errors = validationResult(req);
        const selectedBookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id
        });
        if (!errors.isEmpty()){
            const allBooks = await Book.find({}, "title").exec();
            res.render("bookinstance_form",{
                title: "Update Bookinstance",
                bookinstance: selectedBookinstance,
                book_list: allBooks,
                selected_book: selectedBookinstance.book.id,
                errors: errors.array()

            });
            return;
        } else {
            const updatedBookinstance = await BookInstance.findByIdAndUpdate(req.params.id, selectedBookinstance,{});
            res.redirect(updatedBookinstance.url);
        }
    })
];