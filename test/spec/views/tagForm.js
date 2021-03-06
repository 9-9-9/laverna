/* global chai, define, describe, before, it */
define([
    'require',
    'underscore',
    'jquery',
    'models/tag',
    'apps/notebooks/tagsForm/formView'
], function (require, _, $, Tag, FormView) {
    'use strict';

    var expect = chai.expect;

    describe('Tag form', function () {
        var tag,
            view;

        before(function () {
            tag = new Tag({
                id  : 1,
                name: 'Tag name'
            });

            view = new FormView({
                el: $('<div>'),
                model: tag,
                data: tag.toJSON()
            });

            view.render();
        });

        describe('View is rendered', function () {
            it('is rendered', function () {
                expect(view).to.be.ok();
                expect(view.$el.length).not.to.be.equal(0);
            });

            it('model was passed', function () {
                expect(view.model).to.be.equal(tag);
            });

            it('Shows tags name', function () {
                expect(view.ui.name).to.have.value(tag.get('name'));
            });

            it('Shows validation errors', function (done) {
                tag.on('invalid', function (model, errors) {
                    _.forEach(errors, function (err) {
                        expect(view.ui[err].parent()).to.have.class('has-error');
                        if (errors[errors.length - 1] === err) {
                            done();
                        }
                    });
                });
                tag.save({
                    'name': ''
                });
            });
        });

        describe('Triggers events', function () {
            it('model:save when user submits the form', function (done) {
                tag.on('save', function () {
                    done();
                });
                $('.form-horizontal', view.$el).submit();
            });

            it('model:save when user OK button', function (done) {
                tag.on('save', function () {
                    done();
                });
                $('.ok', view.$el).click();
            });

            it('view:redirect', function (done) {
                view.on('redirect', function () {
                    done();
                });
                view.trigger('hidden.modal');
            });

            it('view:destroy when user hits cancel', function (done) {
                view.on('destroy', function () {
                    done();
                });
                $('.cancelBtn', view.$el).click();
            });
        });

    });

});
