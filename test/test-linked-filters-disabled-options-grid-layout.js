(function (win, TableFilter) {

    var id = function (id) { return document.getElementById(id); };

    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        grid_layout: true,
        linked_filters: true,
        disable_excluded_options: true,
        col_0: 'select',
        col_1: 'checklist'
    });

    tf.init();
    tf.emitter.on(['after-populating-filter'], checkFilters);
    triggerEvents();

    module('Sanity checks');
    test('Linked filters feature', function () {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter instantiated');
        deepEqual(tf.linkedFilters, true, 'Linked filters enabled');
    });

    function triggerEvents() {
        var flt0 = id(tf.fltIds[0]);
        var flt1 = id(tf.fltIds[1]);

        var evObj = document.createEvent('HTMLEvents');
        evObj.initEvent('change', true, true);

        var evObj1 = document.createEvent('HTMLEvents');
        evObj1.initEvent('click', true, true);

        tf.setFilterValue(0, 'Sydney');
        flt0.dispatchEvent(evObj);
        tf.setFilterValue(1, 'Adelaide');
        flt1.querySelectorAll('input')[1].dispatchEvent(evObj1);
    }

    function checkFilters(tf, colIndex, flt) {
        module('behaviour');
        test('Can filter', function () {
            if (colIndex === 0) {
                deepEqual(flt.options.length, 3, 'Filter 0 options number');
            }
            if (colIndex === 1) {
                deepEqual(flt.getElementsByTagName('li').length, 7,
                    'Filter 1 options number');
                testClearFilters();
            }
        });
    }

    // Tests for https://github.com/koalyptus/TableFilter/pull/42 issue
    function testClearFilters() {
        test('Check clear filters functionality', function () {
            tf.clearFilters();

            deepEqual(tf.getFilterableRowsNb(), 7,
                'Nb of valid rows after filters are cleared');

            tearDown();
        });
    }

    function tearDown() {
        tf.emitter.off(['after-populating-filter'], checkFilters);
        test('Tear down', function () {
            tf.destroy();

            deepEqual(tf.isInitialized(), false, 'Filters removed');
        });
    }

})(window, TableFilter);
