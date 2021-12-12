const rank = [1, 2, 3, 4, 5, 6, 7, 8];
const file = ["A", "B", "C", "D", "E", "F", "G", "H"];
let currentTile = null;
let tmpTile = null;
let count = 0;
let reports = [];
let lastAction = "";

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
                $(".tile").eq(count).addClass("black").attr("color", "black");
            } else {
                $(".tile").eq(count).addClass("white").attr("color", "white");
            }
            count++;
        }
    }
}

let moveCount = 0;
const checkMove = function () {
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
    $("span#player-icon").css({"transform" : "rotate(0deg)" });

    let player = $("#player");
    player.removeClass("hide");

    tmpTile = currentTile;
    currentTile = $(t);
    let midY = currentTile.position().top += (currentTile.width() / 2);
    let midX = currentTile.position().left += (currentTile.width() / 2);
    $(".tile").removeClass('legal');
    player.css({"top": midY - (0.5 * player.width()), "left": midX - (0.5 * player.width())});



    const x = currentTile.attr('coordinate');

    let direction = "South"; // NOTE: Pawn can only move to the north now
    let y = null;
    if (tmpTile) {
        y = tmpTile.attr('coordinate');
        if (parseInt(x.charAt(1)) > y.charAt(1) ) {
            direction = "North";
        }
    }

    reports.push( {
        tmp_f: (y)? y.charAt(0) : null,
        tmp_r: (y)? parseInt(y.charAt(1)): null,
        tmp_color: (y)? tmpTile.attr('color'): null,

        f: x.charAt(0),
        r: parseInt(x.charAt(1)),
        color: currentTile.attr('color'),
        direction,
        count: moveCount,

        lastAction
    });

    console.log("Reports", reports);

    moveCount++;
}

$(document).ready(function ($) {
    init();

    $(".tile").on('click', function () {
        placePawn(this);
        $(".btn-controls").removeClass("hide");
        $(".place-wrapper").addClass("hide");
    }).on('mouseenter', function () {
        $(this).addClass('hover');
    }).on('mouseleave', function () {
        $(this).removeClass('hover');
    });

    /**
     * Hint to check allowed steps
     */
    $("#hintPawn").on('click', function () {
        checkMove();
    });

    let showInfo = false;
    $("#infoBtn").on('click', function () {
        $("#report-area").addClass("hide");
        const info = $("#instruction-area");
        if (!showInfo) {
            info.removeClass('hide');
            showInfo = true;
        } else {
            info.addClass('hide');
            showInfo = false;
        }
    });

    $("#place-pawn").on('click', function () {
        console.log("PLACE");
        $('*[coordinate="A1"]').trigger('click'); // first position
    });

    $("#command-move").on('click', function () {
        lastAction = "MOVE";
        if (!currentTile) {
            alert("Please place a pawn!");
            return false;
        }
        console.log("MOVE");
        $("span#player-icon").css({"transform" : "rotate(0deg)" });
        const x = currentTile.attr('coordinate');
        const f = x.charAt(0);
        const r = parseInt(x.charAt(1))+1; // stepping

        if (r > rank.length) {
            alert("cannot move next, reaching maximum board length!");
        } else {
            $('*[coordinate="'+(f+r)+'"]').trigger('click');
        }

    });

    $("#command-left").on('click', function () {
        // LEFT and RIGHT will rotate the pawn 90 degrees in the specified direction without
        // changing the position of the pawn.
        lastAction = "LEFT";
        $("span#player-icon").css({"transform" : "rotate(-90deg)" });
    });

    $("#command-right").on('click', function () {
        // LEFT and RIGHT will rotate the pawn 90 degrees in the specified direction without
        // changing the position of the pawn.
        lastAction = "RIGHT";
        $("span#player-icon").css({"transform" : "rotate(90deg)" });
    });

    $("#command-report").on('click', function () {
        $("#report-area").removeClass("hide");
        $("#instruction-area").addClass("hide");

        reports.forEach((v, index) => {
            $("#report-body").html( $("#report-body").html() + `
            <ul>
                <li>PLACE (${(v.tmp_f)? v.tmp_f : 'A' }, ${(v.tmp_r)? v.tmp_r : '0' }), ${(v.direction) ? v.direction : "-"}, ${v.color}</li> 
                <li> ${lastAction}  ${v.count+1}</li>
                <li>REPORT</li>
                <li>PLACE ${(v.f)? v.f : 'A' },${(v.r)? v.r : '0' }, ${(v.direction) ? v.direction : "-"}, ${v.color}</li> 
            </ul>
            `);
        });
    });
});


$(document).keydown(function(e) {
    switch(e.keyCode) {
        case 13:
            $('*[coordinate="A1"]').trigger('click'); // first position
            break;
        case 27:
            location.reload(); // reset
            break;
        case 38:
            $("#command-move").trigger('click');
            break;
        case 37:
            $("#command-left").trigger('click');
            break;
        case 39:
            $("#command-right").trigger('click');
            break;
        case 40:
            alert("Pawn cannot step back!")
            break;
    }
});