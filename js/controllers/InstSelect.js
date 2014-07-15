angular.module("sharc").controller("InstSelect",
    function ($scope, $http) {
         $http.get('/json/metadata.json').success(function(data) {
             $scope.instMetadata = data;
             // console.log(JSON.stringify(data));
         });

         $scope.changeInstrument = function() {
             $scope.notes = [];
             $.each($scope.instMetadata, function(i, inst) {
                 if (inst.instname == $scope.selectedInstrument) {
                     $scope.notes = inst.notes;
                     return false;
                 }
             });
         };

         $scope.makeHighChartData = function () {
             var result = {};
             $http.get($scope.selectedFile).success(function(data) {
                 $scope.noteData = data;
                 result.title =  {
                    text: $scope.selectedInstrument,
                    x: -20 
                 };
                 result.subtitle = {
                    text: 'Note: ' + $scope.selectedFile,
                    x: -20
                 };
                 result.xAxis = {"categories": []};
                 $.each($scope.noteData.harmonics, function(i, harm) {
                     result.xAxis.categories.push(harm.num);
                 });
                 result.yAxis = {
                    title: {
                        text: $scope.outputType
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                 };
                 result.tooltip = {
                    valueSuffix: ''
                 };
                 result.legend = {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                 };
                 result.series = [{
                    name: $scope.selectedInstrument,
                    data: []
                 }];
                 $.each($scope.noteData.harmonics, function(i, harm) {
                      var level = $scope.outputType == "amplitude" ? harm.amp : harm.db;
                     result.series[0].data.push(level);
                 });
                 $('#container').highcharts(result);
             });
         };
    }

);
