var models=require('../models/models.js');


exports.load=function(req,res,next,quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz=quiz;
				next();
			}else{
				next(new Error('No existe quizId'+quizId));
			}
		}
	).catch(function(error){
		next(error);
	});
};

exports.index=function(req,res,next){
	var search="%";
	if(req.query.search!=undefined){
		search="%"+req.query.search.toUpperCase()+"%";
		search=search.trim().replace(/\s/g,"%");
	}
	models.Quiz.findAll({where:["upper(pregunta) like ?", search],order:'pregunta ASC'}).then(
		function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes,errors:[]});
		}
	).catch(function(error){
		next(error);
	});
};

exports.show=function(req,res){
	res.render('quizes/show',{quiz:req.quiz,errors:[]});
};

exports.answer=function(req,res){
	var resultado='Incorrecto';
	if(req.query.respuesta===req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado,errors:[]});
};

exports.new=function(req,res){
	var quiz=models.Quiz.build(
		{
			pregunta:"Pregunta",
			respuesta:"Respuesta",
			tema:"Tema"
		}
	);
	res.render('quizes/new',{quiz:quiz,errors:[]});
};
exports.create=function(req,res){
	var quiz=models.Quiz.build(req.body.quiz);

	//Guarda en DB los campos pregunta y respuesta de quiz
	quiz.validate().then(function(err){
		if(err){
			res.render('quizes/new',{quiz:quiz, errors:err.errors});
		}else{
			quiz.save({fields:["pregunta","respuesta","tema"]}).then(function(){
				res.redirect('/quizes');
			});
		}
	});
};

exports.edit=function(req,res){
	var quiz=req.quiz;

	res.render('quizes/edit',{quiz:quiz, errors: []});
};

exports.update=function(req,res){
	req.quiz.pregunta=req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;
	req.quiz.tema=req.body.quiz.tema;

	req.quiz.validate().then(function(err){
		if(err){
			res.render('quizes/edit',{quiz:req.quiz, errors:err.errors});
		}else{
			req.quiz.save({fields:["pregunta","respuesta","tema"]})
			.then(function(){
				res.redirect('/quizes');
			});
		}
	});
};

exports.destroy=function(req,res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){
		next(error);
	});
};

exports.author=function(req,res){
	res.render('author',{errors:[]});
};