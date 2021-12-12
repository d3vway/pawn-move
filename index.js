const rank = [1, 2, 3, 4, 5, 6, 7, 8];
const file = ["A", "B", "C", "D", "E", "F", "G", "H"];
let currentTile = {};
let count = 0;

const init = function () {
    for (let r = rank.length; r >  0; r--) {
        for (let f = 0; f < file.length; f++) {

            // Append tile
            let style = '';
            if (count % 8 == 0) {
                style = 'clear:left';
            }

            let coordinate = file[f] + r;
            $("#chess-board").append('<div class="tile" style="' + style + '">' + coordinate + '</div>');

            $(".tile").eq(count).attr("coordinate", coordinate);

            // Tile's color
            if (((r % 2 == 0) && (f % 2 != 0)) || ((r % 2 != 0) && (f % 2 == 0))) {
                $(".tile").eq(count).addClass("black");
            } else {
                $(".tile").eq(count).addClass("white");
            }
            count++;
        }
    }
}

let moveCount = 0;
const legalMove = function () {
    $(".tile").removeClass('legal');

    const x = currentTile.attr('coordinate');
    const f = x.charAt(0);
    const r = parseInt(x.charAt(1));

    if (moveCount <= 1) {
        for (let step=r;step<=(r+2);step++) {
            $('*[coordinate="' + f + (step) + '"]').addClass('legal');
        }
    } else {
        $('*[coordinate="' + f+(r+1) + '"]').addClass('legal');
    }

    currentTile.removeClass('legal');

}

function placePawn(t) {
    currentTile = $(t);
    let midY = currentTile.position().top += (currentTile.width() / 2);
    let midX = currentTile.position().left += (currentTile.width() / 2);
    let player = $("#player");
    $(".tile").removeClass('legal');
    player.css({"top": midY - (0.5 * player.width()), "left": midX - (0.5 * player.width())});

    moveCount++;
}

$(document).ready(function ($) {
    init();

    $(".tile").on('click', function () {
        placePawn(this);
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

    $('*[coordinate="A1"]').trigger('click'); // first position

});
