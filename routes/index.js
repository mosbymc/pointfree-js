var request =           require('request'),
    testData =          require('../test/testData');

module.exports = function _routes(router) {
    router.get('/queryable');
    router.post('/grid/updateData', updateGridData);

    router.get('/grid/getpage', getGridPageData);

    router.get('/grid/getInitialDataSource', getInitialGridDataSource);

    router.get('/grid/drilldown/getpage', getDrillDownData);
};

var reqObj = {
    filters: null,
    groupedBy: null,
    pageNum: 1,
    pageSize: 25,
    sortedBy: null,
    sortedOn: null
};

var getGridPageData = function _getGridPageData(req, response) {
    request('http://localhost:5500/auto-repairs', function(err, res, body) {
        if (!err && res.statusCode == 200) {
            determinePageData(req.query, JSON.parse(body), columns, function(err, data) {
                response.send(data);
                //response.send(null);
                response.end()
            });
        }
        else {
            response.send();
            response.end();
        }
    });
};

var updateGridData = function _updateGridData(request, response) {
    response.send(request.body);
    response.end();
    /*performUpdate(function _updatesComplete(err, res) {
     response.send(res);
     response.end();
     });*/
};

function performUpdate(models, callback) {
    var idx = 0;
    makePutRequest(models[idx], function _updateCallback(err, res) {
        if (!err && models.length > 1) performUpdate(models.slice(1, models.length), callback);
        else callback(err, res);
    });
}

function makePutRequest(model, callback) {
    request.put('http://localhost:5500/auto-repairs', model, function(err, res, body) {
        callback(err, res, body);
    });
}

var getInitialGridDataSource = function _getInitialGridDataSource(req, res) {
    res.send(originalData);
    res.end();
};

var getDrillDownData = function _getDrillDownData(req, response) {
    request('http://localhost:5500/auto-repair-info', function(err, res, body) {
        if (!err && res.statusCode == 200) {
            var childData = findDataByParentId(JSON.parse(body), req.query.parentId);
            determinePageData(req.query, childData, drillDownColumns, function(err, data) {
                response.send(data);
                response.end();
            });
        }
        else {
            response.send();
            response.end();
        }
    });
};