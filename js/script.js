$(function () {

    function formatMoney(value) {
        return value.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function computeGroup(group) {

        const column = $('.table-column-data[data-group="' + group + '"]');

        const qty = parseInt(column.find(".group-qty").val()) || 0;

        let subtotal = 0;

        column.find(".item-checkbox:checked").each(function () {

            const price = parseFloat($(this).closest(".item").data("price"));

            subtotal += price * qty;

        });

        const savings = subtotal * 0.10;
        const total = subtotal - savings;

        $("#" + group + "-total").val(formatMoney(subtotal));
        $("#" + group + "-discount").val(formatMoney(total));

        $("#subtotal_" + group).text(formatMoney(total));

        return {
            subtotal: subtotal,
            savings: savings,
            total: total
        };

    }

    function computeEverything() {

        const principal = computeGroup("principal");
        const bridesmaid = computeGroup("bridesmaid");
        const groomsmen = computeGroup("groomsmen");

        const grandTotal =
            principal.total +
            bridesmaid.total +
            groomsmen.total;

        const totalSavings =
            principal.savings +
            bridesmaid.savings +
            groomsmen.savings;

        const deposit = parseFloat($("#total_deposit").val()) || 0;

        const balance = Math.max(0, grandTotal - deposit);

        $("#total_grand").text(formatMoney(grandTotal));
        $("#total_savings").text(formatMoney(totalSavings));
        $("#total_balance").text(formatMoney(balance));

    }

    // Checkbox changes
    $(document).on("change", ".item-checkbox", computeEverything);

    // Quantity changes
    $(document).on("input", ".group-qty", computeEverything);

    // Deposit changes
    $("#total_deposit").on("input", computeEverything);

    computeEverything();


    function inputDP() {
        $('#total_deposit')
            .on('focus', function () {
                $(this).val('');
            })
            .on('blur', function () {
                var value = $.trim($(this).val());
    
                if (value === '' || isNaN(value) || parseFloat(value) === 0) {
                    $(this).val('0.00');
                }
            });
    }
    inputDP();

    
    // function clearInputs() {
    //     $(".clear").on("click", function (e) {
    //         e.preventDefault();
    
    //         // Uncheck all items
    //         $(".item-checkbox").prop("checked", false);
    
    //         // Reset quantities
    //         $(".group-qty").val(0);
    
    //         // Reset deposit
    //         $("#total_deposit").val("0.00");
    
    //         // Recompute totals
    //         computeEverything();
    //     });
    // }
    // clearInputs();

    function preventPageRefresh() {
        function beforeUnloadHandler(e) {
            e.preventDefault();
            e.returnValue = "";
        }
    
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return beforeUnloadHandler;
    }
    // const beforeUnloadHandler = preventPageRefresh();


    function clearInputs() {
        $(".clear").on("click", function (e) {
            e.preventDefault();
    
            // Scroll to the top
            window.scrollTo({
                top: 0,
                behavior: "instant" // or omit "behavior"
            });
    
            // Disable the beforeunload warning
            window.removeEventListener("beforeunload", beforeUnloadHandler);
    
            // Reload the page
            location.reload();
        });
    }
    clearInputs();

});