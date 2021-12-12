const rank = ["A", "B", "C", "D", "E", "F", "G", "H"];
const file = [1, 2, 3, 4, 5, 6, 7, 8];
let currentTile = {};
let count = 0;
let tiles = $(".tile");

const initBoard = function () {
    for (let r = 0; r < rank.length; r++) {
        for (let f = 0; f < file.length; f++) {

            if (count % 8 == 0) {
                $("#chess-board").append('<div class="tile" style="clear:left"></div>');

            } else {
                $("#chess-board").append('<div class="tile"></div>');
            }

            $(".tile").eq(count).attr("tile-pos", ((rank[rank.length - (r + 1)] + file[f])));

            if (((r % 2 == 0) && (f % 2 != 0)) || ((r % 2 != 0) && (f % 2 == 0))) {
                $(".tile").eq(count).addClass("black");
            } else {
                $(".tile").eq(count).addClass("white");
            }
            count++;
        }
    }
}

const legalMove = function () {
    tiles.removeClass('legal');
    let gridpos = currentTile.attr('tile-pos');
    let l_rank = ($.inArray(gridpos.charAt(0), rank));
    let l_file = ($.inArray(parseInt(gridpos.charAt(1)), file));
    let ID = rank[l_rank + 1] + file[l_file];
    $('*[tile-pos="' + ID + '"]').addClass('legal');
    currentTile.removeClass('legal');

}

$( document ).ready(function($) {
    initBoard();
    let tiles = $(".tile");

    $(".tile").on('click', function () {
        currentTile = $(this);
        let midY = $(this).position().top += ($(this).width() / 2);
        let midX = $(this).position().left += ($(this).width() / 2);
        let player = $("#player");
        tiles.removeClass('legal');
        player.css({"top": midY - (0.5 * player.width()), "left": midX - (0.5 * player.width())});
    })
        .on('mouseenter', function () {
            $(this).addClass('hover');
        })

        .on('mouseleave', function () {
            $(this).removeClass('hover');
        });

    $("#hintPawn").on('click', function () {
        legalMove();
    });

    let showInfo = false;
    $("#infoBtn").on('click', function () {
        const info = $("#instruction-area");
        if (!showInfo) {
            info.removeClass('hide');
            showInfo = true;
        } else {
            info.addClass('hide');
            showInfo = false;
        }
    })

    $('*[tile-pos="A1"]').trigger('click');
});
