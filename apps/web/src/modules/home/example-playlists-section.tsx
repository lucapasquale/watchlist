import { Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@ui/lib/utils";

const playlistExamples = [
  {
    id: 1,
    name: "test 1",
    category: "funny",
  },
  {
    id: 4,
    name: "test 4",
    category: "music",
  },
];

export function ExamplePlaylistsSection() {
  return (
    <section className="w-full py-12 xl:py-24 overflow-hidden">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Discover Amazing Playlists</h2>

        <div className="flex justify-center items-center space-x-16">
          {playlistExamples.map((playlist) => (
            <Link
              key={playlist.id}
              to="/p/$playlistID"
              params={{ playlistID: playlist.id.toString() }}
              className="group perspective"
            >
              <div
                className={cn(
                  "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105",
                )}
              >
                <div className="relative h-48 w-64 aspect-video">
                  {/* <img src={playlist.image} alt={playlist.name} className="object-cover" /> */}

                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>

                <h3 className="font-semibold text-lg text-gray-800 mb-2 p-4">{playlist.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
