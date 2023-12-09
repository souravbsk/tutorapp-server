const subscriptionusers = require("../models/subscriptionusers.model");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
 
  const newSubscriptionusers = new subscriptionusers({
    userid: req.body.userid,
    planid: req.body.planid,
    startdate: req.body.startdate,
    expdate: req.body.expdate,
    totalclicks: req.body.totalclicks,
    usedclicks: req.body.plantypes || false,
    status: req.body.status,
  });

  // Save Subscriptionplans in the database
  subscriptionusers.create(newSubscriptionusers, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the newSubscriptionusers.",
      });
    else res.send(data);
  });
};



exports.findOne = (req, res) => {
  const plantype = req.query.plantype;
  const studentTrue = req.query.student;
  const teacherTrue = req.query.teacher;
  subscriptionusers.findById(req.params.id,plantype, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found subscriptionusers with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving subscriptionusers with id " + req.params.id,
        });
      }
    }

    // const activePlans = [];

    // data.map((plans) => {
    //   const currentDate = new Date();
    //   const planExptdate = new Date(plans.expdate);

    //   if (planExptdate > currentDate) {
    //     const daysDifference = planExptdate - currentDate;
    //     const daysLeft = Math.ceil(daysDifference / (1000 * 60 * 60 * 24));

    //     if (plans.usedclicks < plans.totalclicks && daysLeft > 0) {
    //       const planLeft = {
    //         planActive: true,
    //         userId: plans.userid,
    //         pnalTypeId: plans.plantypeid,
    //         planTypeName: plans.plantypename,
    //         planId: plans.planid,
    //         planName: plans.planname,
    //         planStart: plans.startdate,
    //         planExpiry: plans.expdate,
    //         daysLeft: daysLeft,
    //         totalClicks: plans.totalclicks,
    //         clicksLeft: plans.totalclicks - plans.usedclicks,
    //         clicksUsed: plans.usedclicks,
    //         planStatus: plans.status,
    //       };
    //       activePlans.push(planLeft);
    //     }
    //   }
    // });
    
    // if (activePlans.length != 0) {
    //   res.send(activePlans);
    // } else {
    //   res.status(404).send({success:false})
    // }
    // if(studentTrue){
    // }
    
    const currentDate = new Date();
    const activePlans = data.filter((item)=>{
      if(item.status === "y" && item.totalclicks > 0 ){
        return item
      }else if(item.status === "y" && (new Date(item.expdate) > currentDate )){
        return item
      }
    })

    res.send(activePlans);
    
  });
};



exports.updateById = (req, res) => {

  if (!req.params) {
    res.status(400).send({
      message: "params can not be empty!",
    });
    return
  }

  const subscriptionusers_id = req.params.id;
 
  subscriptionusers.update(subscriptionusers_id, (err, data) => {
  
      if(err){
        res.status(404).send({
          message: "Error updating ussubscriptionusers with id " + subscriptionusers_id,
        });
      }else res.send({
        success: true,
        data,
      });

  });
};