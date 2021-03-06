/* global define */
define([
    'underscore',
    'app',
    'marionette',
    'helpers/uri',
    'collections/notebooks',
    'models/notebook',
    'apps/encryption/auth',
    'apps/notebooks/notebooksForm/formView'
], function (_, App, Marionette, URI, Notebooks, Notebook, getAuth, FormView) {
    'use strict';

    var Form = App.module('AppNotebooks.NotebookForm');

    Form.Controller = Marionette.Controller.extend({
        initialize: function () {
            _.bindAll(this, 'addForm', 'editForm', 'show');

            this.collection = new Notebooks([], {
                comparator: 'name'
            });
        },

        // Create form initializing
        addForm: function (args) {
            this.model = new Notebook();
            this.isNew = true;
            this.args = args;

            // Set profile
            this.collection.database.getDB(args.profile);

            $.when(this.collection.fetch()).done(this.show);
        },

        // Edit form initializing
        editForm: function (args) {
            this.model = new Notebook({id: args.id});
            this.args = args;

            // Set profile
            this.collection.database.getDB(args.profile);

            $.when(this.collection.fetch(), this.model.fetch()).done(this.show);
        },

        // Shows form
        show: function () {
            var data = this.model.decrypt();

            this.view = new FormView ({
                collection: this.collection,
                model: this.model,
                data: data
            });

            App.modal.show(this.view);
            this.model.on('save', this.save, this);
            this.view.on('redirect', this.redirect, this);
        },

        /**
         * Saves changes
         */
        save: function (data) {
            var self = this;

            // First we need to encrypt data
            this.model.set(data).encrypt();

            this.model.save(this.model.toJSON(), {
                success: function (model) {
                    if (self.isNew === true) {
                        App.trigger('new:notebook', model);
                    }

                    self.view.trigger('destroy');
                    self.redirect();
                }
            });
        },

        // Redirect
        redirect: function () {
            if (_.isNull(this.args.redirect) || this.args.redirect === true) {
                return App.navigate('#' + URI.link('/notebooks'));
            }
        }

    });

    return Form.Controller;
});
