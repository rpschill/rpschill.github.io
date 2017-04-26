/*global angular*/

(function () {
    'use strict';

    angular.module('app', [
            'ngRoute'
        ])

        .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {

            $routeProvider

                .when('/', {
                    templateUrl: 'app/views/home.html'
                })

                .when('/developer', {
                    templateUrl: 'app/views/portfolio.html',
                    controller: 'DevCtrl',
                    controllerAs: 'dev'
                })
                
                .when('/journalist', {
                    templateUrl: 'app/views/portfolio.html',
                    controller: 'JournoCtrl',
                    controllerAs: 'dev'
                })

                .when('/artist', {
                    templateUrl: 'app/views/portfolio.html',
                    controller: 'ArtCtrl',
                    controllerAs: 'dev'
                })

                .otherwise({
                    redirectTo: '/'
                });
        }])

        .factory('DevProjects', [function () {

            var projects = [

                {
                    title: 'projectr',
                    url: 'https://rpschill.github.io/projectr-app[',
                    description: 'Feature-rich project and task management software with integrated timers and robust reporting -- all in the cloud.',
                    subtitle: 'Buit in JavaScript with AngularJS, Angular Material, and Firebase.',
                    imgUrl: 'app/assets/projectr.png'
                },

                {
                    title: 'pomoDerp',
                    url: 'https://rpschill.github.io/pomoderp',
                    description: 'A fully configurable pomo-style timer. Because your pomo needs more derp.',
                    subtitle: '',
                    imgUrl: 'app/assets/pomoderp.png'
                },

                {
                    title: 'Calculator',
                    url: 'http://rpschill.github.io/calculator',
                    description: 'Just a basic calculator',
                    subtitle: '',
                    imgUrl: 'app/assets/calculator.png'
                }
            ];

            return projects;

        }])

        .factory('Journalism', [function () {

            var articles = [

                {
                    title: 'A Question of Intention and Juvenile Solitary Confinement',
                    url: 'https://medium.com/juvenile-justice-news/reporters-notebook-a-question-of-intention-and-juvenile-solitary-confinement-31e17925fd9a#.qu1297hbc',
                    description: 'We know solitary confinement hurts kids. Is that the fault of the isolation cell? Or does the fault rest in how we use the cell?',
                    subtitle: 'Originally published in the Juvenile Justice Information Exchange (jjie.org), March 14, 2014.',
                    imgUrl: 'http://placehold.it/300x150'
                },

                {
                    title: 'Fractured Leg, Fractured Family',
                    url: 'https://medium.com/@rpschill/fractured-leg-fractured-family-6b473bce3b43#.tji2ylm2z',
                    description: 'A misdiagnosis leads to allegations of abuse',
                    subtitle: 'Originally published in the Juvenile Justice Information Exchange (jjie.org), October 3, 2011.',
                    imgUrl: 'http://placehold.it/300x150'
                },

                {
                    title: 'Chasing the Dragon: Suburban Heroin Stories',
                    url: 'https://medium.com/@rpschill/chasing-the-dragon-suburban-heroin-stories-83d150e2e073#.4txbfax5r',
                    description: 'In the affluent suburbs of Atlanta, teens are increasingly moving to heroin as a cheap alternative to prescription painkillers',
                    subtitle: 'Originally published in the Juvenile Justice Information Exchange (jjie.org), August 3, 2011.',
                    imgUrl: 'http://placehold.it/300x150'
                }
            ];

            return articles;

        }])

        .factory('Art', [function () {

            var art = [

                {
                    title: "Interview and discussion of 'Question Mark'",
                    url: 'https://youtu.be/EhT0m3b2f1Q',
                    description: 'Carl Raschke, Professor of Religious Studies at the University of Denver, interviewed me about my work of sequential art, "Question Mark," for the exhibition, "Toward the Light: Making Visible Our Inner Struggles."',
                    subtitle: 'Part of the Global Arts & Ideas Nexus',
                    imgUrl: 'http://placehold.it/300x150'
                }
            ];

            return art;

        }])

        .controller('DevCtrl', function (DevProjects) {

            var vm = this;

            vm.pageTitle = 'Web Development Projects';
            vm.projects = DevProjects;
        })

        .controller('JournoCtrl', function(Journalism) {

            var vm = this;

            vm.pageTitle = 'Selected Journalism Portfolio';
            vm.projects = Journalism;
        })

        .controller('ArtCtrl', function(Art) {

            var vm = this;

            vm.pageTitle = 'Selected Visual Art Portfolio';
            vm.projects = Art;
        })


})(angular);